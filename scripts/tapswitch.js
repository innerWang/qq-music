  // tab切换功能
  
  let indexOfTabChanged = false
  document.querySelector('.navbar').addEventListener('click',function(e){
    if(e.target.nodeName.toLowerCase()=== 'li'){
      let target = e.target
      if(!target.getAttribute('class')){
        indexOfTabChanged = true
      }
      ;[].forEach.call(target.parentElement.children,ele => {
        ele.classList.remove('current')
      })
      target.classList.add('current')

      let content = document.querySelector(target.dataset.view)
      if(content){
        [].forEach.call(content.parentElement.children,ele => {
          ele.classList.remove('active')
        })
        content.classList.add('active')
      }
    }
  })


setInterval(function(){
  if(indexOfTabChanged){
    console.log('tab changed...')
    window.dispatchEvent(new Event('scroll'))
    indexOfTabChanged = false
  }
},100)