class Slider {
  constructor(options = {}){
    this.$el = options.el
    this.slideItems = options.slideItems
    this.interval = options.interval || 3000
    this.index = 0
    this.render()
    this.start()
  }

  render(){
   // console.log('render...')
    this.$el.innerHTML = `<div class="qq-slider-wrap"></div>`
    this.$wrap = this.$el.firstElementChild
    this.$wrap.style.width = `${this.slideItems.length*100}%`
   // console.log(this.$wrap.style.width)
    this.$wrap.innerHTML = this.slideItems.map(item => 
      `<div class="qq-slider-item">
      <a href="${item.link}">
        <img src="${item.img}" alt="">
      </a>
    </div>` 
    ).join('')
    //this.$wrap.appendChild( this.$wrap.firstElementChild.cloneNode(true))
  }

  start(){
    setInterval(this.next.bind(this),this.interval)
  }

  next(){
    this.index +=1
  //  console.log('next...',this.index )
    if(this.index === this.slideItems.length){
      this.index = 0
    }
    let x = `-${this.index *100 / this.slideItems.length}%`
    this.$wrap.style.transform = `translateX(${x})`
  }
}


