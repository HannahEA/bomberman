
// const = isArray = child => child.constructor !== Array
function createElement(type, props, ...children) {
  // console.log("element children", children)
  // let childList = children.flat()
  
 
  let element = {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === "object") {
          // console.log("child", child)
          return child
        } else if(typeof child === "string" ) {
          return createTextElement(child)
        }
      }),
    },
  }
  // console.log("Element Created:", element)
    return element
  }

  
  function createTextElement(text) {
    // console.log("text elment", text)
    return {
      type: "TEXT_ELEMENT",
      props: {
        nodeValue: text,
        children: [],
      },
    }
  }


  
  function createDom(fiber) {
    // console.log("we are creating the dom")
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type)
    // console.log("creating dom", dom, fiber.type)
    updateDom(dom, {}, fiber.props)
  
    return dom
  }
  
  const isEvent = key => key.startsWith("on")
  const isProperty = key =>
    key !== "children" && !isEvent(key)
  const isNew = (prev, next) => key =>
    prev[key] !== next[key]
  const isGone = (prev, next) => key => !(key in next)
  function updateDom(dom, prevProps, nextProps) {
    // console.log("current dom, ", dom)
    //Remove old or changed event listeners
    Object.keys(prevProps)
      .filter(isEvent)
      .filter(
        key =>
          !(key in nextProps) ||
          isNew(prevProps, nextProps)(key)
      )
      .forEach(name => {
        const eventType = name
          .toLowerCase()
          .substring(2)
        dom.removeEventListener(
          eventType,
          prevProps[name]
        )
      })
  
    // Remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = ""
      })
  
    // Set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        // console.log("property: ",name, nextProps[name])
        dom[name] = nextProps[name]
      })
  
    // Add event listeners
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name
          .toLowerCase()
          .substring(2)
        dom.addEventListener(
          eventType,
          nextProps[name]
        )
      })
  }
  
  function commitRoot() {
    pendingEffects.forEach(it => it()) // call pending effects after render
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
  }
  
  function commitWork(fiber) {
    if (!fiber) {
      return
    }
  
    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber.dom
  
    if (
      fiber.effectTag === "PLACEMENT" &&
      fiber.dom != null
    ) {
      // console.log("PLACEMENT: new item", fiber.dom)
      domParent.appendChild(fiber.dom)
    } else if (
      fiber.effectTag === "UPDATE" &&
      fiber.dom != null
    ) {
      updateDom(
        fiber.dom,
        fiber.alternate.props,
        fiber.props
      )
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent)
    }
  
    commitWork(fiber.child)
    commitWork(fiber.sibling)
  }
  
  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      //domParent.removeChild(fiber.dom) //HS changed as per: https://github.com/pomber/didact/issues/30
      fiber.dom.remove()
    } else {
      commitDeletion(fiber.child, domParent)
    }
  }
  
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    }
    // console.log("wipRoot, ", wipRoot)
    deletions = []
    nextUnitOfWork = wipRoot
  }
  
  let nextUnitOfWork = null
  let currentRoot = null
  let wipRoot = null
  let deletions = null
  
  function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(
        nextUnitOfWork
      )
      shouldYield = deadline.timeRemaining() < 1
    }
  
    if (!nextUnitOfWork && wipRoot) {
      commitRoot()
    }
  
    requestIdleCallback(workLoop)
  }
  
  requestIdleCallback(workLoop)
  
  function performUnitOfWork(fiber) {
    const isFunctionComponent =
      fiber.type instanceof Function
    if (isFunctionComponent) {
      // console.log("found function component")
      updateFunctionComponent(fiber)
      
    } else {
      // console.log("found host component")
      updateHostComponent(fiber)
    }
    //?? child
    if (fiber.child) {
      // console.log("next unit of work fiber.child")
      return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        //?? sibling
        
      if (nextFiber.sibling) {
        // console.log("next unit of work fiber.sibling")
        return nextFiber.sibling
      }
      // console.log("next unit of work fiber.parent")
      //?? parent
      nextFiber = nextFiber.parent
    }
  }
  
  let wipFiber = null
  let hookIndex = null
  
  function updateFunctionComponent(fiber) {
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = []
    // console.log("creating function children")
    const children = [fiber.type(fiber.props)]
    // console.log("function component childen:", children, fiber.type, "props", fiber.props)
    reconcileChildren(fiber, children.flat())
  }
  
  function useState(initial) {
    const oldHook =
      wipFiber.alternate &&
      wipFiber.alternate.hooks &&
      wipFiber.alternate.hooks[hookIndex]
    const hook = {
      state: oldHook ? oldHook.state : initial,
      queue: [],
    }
  
    const actions = oldHook ? oldHook.queue : []
    actions.forEach(action => {
      //hook.state = action(hook.state) //HS changed according to: https://github.com/pomber/didact/pull/34/files
      hook.state = typeof action === 'function' ? action(hook.state) : action
    })
  
    const setState = action => {
      hook.queue.push(action)
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      }
      nextUnitOfWork = wipRoot
      deletions = []
    }
  
    wipFiber.hooks.push(hook)
    hookIndex++
    return [hook.state, setState]
  }
  // ------------------------------------------------------------------------- //
  let pendingEffects = []
  function useEffect(fn, deps) {
    const hook = {
        tag: "EFFECT",
        fn,
        deps,
    }

    wipFiber._hooks.push(hook)
    hookIndex++
}


  // ------------------------------------------------------------------------- //

  
  function updateHostComponent(fiber) {
    // console.log("updating host")
    if (!fiber.dom) {
      // console.log("udating host: no dom: fiber = ", fiber)
      fiber.dom = createDom(fiber)
    }
    reconcileChildren(fiber, fiber.props.children.flat())
  }
  
  function reconcileChildren(wipFiber, elements) {
    let index = 0
    //?? what is oldFiber
    let oldFiber =
      wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null
  
    while (
      index < elements.length ||
      oldFiber != null
    ) {
      const element = elements[index]
      let newFiber = null
      //changed: oldFiber && element && element.type == oldFiber.type 
      //&& element.props == oldFiber.props
      const sameType =
        oldFiber &&
        element &&
        element.type == oldFiber.type
  
      if (sameType) {

        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE",
        }
      }
      if (element && !sameType) {
        // console.log("reconcile children element:", element, "\n parent: ", wipFiber)
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
        }
      }
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION"
        deletions.push(oldFiber)
        // console.log("removing dom", oldFiber)
      }
  
      if (oldFiber) {
        //?? what about children
        oldFiber = oldFiber.sibling
      }
  
      if (index === 0) {
        wipFiber.child = newFiber
      } else if (element) {
        //?? assingnment to wipfiber
        prevSibling.sibling = newFiber
      }
  
      prevSibling = newFiber
      index++
    }
  }
  
  export const Web_pilot = {
    createElement,
    render,
    useState,
  }

//======> Start of function exercises <=======

  ///** @jsx Web_pilot.createElement */
  //To read window URL:
  /*myKeyValues = window.location.search
  const urlParams = new URLSearchParams()
  //URLSearchParams.set()
  let param1 = URLSearchParams.get('name');
  //console.log("name:", param1)

  //from: https://www.youtube.com/watch?v=RIBiQ5GNYWo
  //To set URL value: 
  let myURL = new URL('https://www.youtube.com');
  console.log("the hostname is:", myURL.hostname)
  //to change my url hostname value:
  myURL.hostname =  'google.com';
  //to see the entire new url:
  let my newURL = myURL.href
  console.log(newURL.toString());

  //newURL.search = "?name=dom&age=56";
  newURL.searchParams.set("name","dom");
   newURL.searchParams.set("age","72");
  */



 



 





