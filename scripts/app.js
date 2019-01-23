(async function(){

  fetch('/json/rec.json')
    .then( res=> res.json())
    .then(renderRecm)

  function renderRecm(originalData){
    renderSlider(originalData.data.slider)
    renderRadio(originalData.data.radioList)
    console.log($$('.lazyload'))
    lazyload($$('.lazyload'))
  }
  
  function renderSlider(sliderData){
    let slideItems =  sliderData.map(item => {
      return {link: item.linkUrl,img:item.picUrl}
    })
    new Slider({
      el: $('.qq-slider'),
      slideItems
    })
  }

  function renderRadio(radioData){
    $('.radio .list-container').innerHTML =  radioData.map(item => {
      return `<li class="list-item">
      <a href="#">
        <div class="item-media">
          <img class="lazyload" src="images/static.jpg" data-src="${item.picUrl}" alt="">
          <span class="icon"></span>
        </div>
        <div class="item-info">
          <h3>${item.Ftitle}</h3>
        </div>
      </a>
    </li>`
    }).join('')

    
  }

  // tab切换功能
  $('.navbar').addEventListener('click',function(e){
    if(e.target.nodeName.toLowerCase()=== 'li'){
      let target = e.target
      ;[].forEach.call(target.parentElement.children,ele => {
        ele.classList.remove('current')
      })
      target.classList.add('current')

      let content = $(target.dataset.view)
      if(content){
        [].forEach.call(content.parentElement.children,ele => {
          ele.classList.remove('active')
        })
        content.classList.add('active')
      }
    }
  })
  

})()