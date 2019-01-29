import {Slider} from './carousel.js'
import {lazyload} from './lazyload.js'
export class Recommend{
  constructor(el){
    this.$el = el
    this.launch()
  }

  launch(){
    fetch('https://qq-music-api.now.sh')
    .then( res=> res.json())
    .then(json => this.json = json)
    .then(() => this.renderRecm())
  }

  renderRecm(){
    this.renderSlider(this.json.data.slider)
    this.renderRadio(this.json.data.radioList)
    this.renderHotSong(this.json.data.songList)
    lazyload(this.$el.querySelectorAll('.lazyload'))
  }

  renderSlider(sliderData){
    this.slider = new Slider({
      el: this.$el.querySelector('.qq-slider'),
      slideItems: sliderData.map(item => ({link: item.linkUrl,img:item.picUrl}))
    })
  }

  renderRadio(radioData){
    this.$el.querySelector('.radio .list-container').innerHTML =  radioData.map(item => {
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

  renderHotSong(hotSongData){
    this.$el.querySelector('.hot-song .list-container').innerHTML =  hotSongData.map(item => {
      return `<li class="list-item">
      <a href="#">
        <div class="item-media">
          <img class="lazyload" src="images/static.jpg" data-src="${item.picUrl}" alt="">
          <span class="icon"></span>
        </div>
        <div class="item-info">
          <h3>${item.songListDesc}</h3>
        </div>
      </a>
    </li>`
    }).join('') 
  }

}