export class MusicPlayer {
  constructor(el){
    this.$el = el
    this.$play= this.$el.querySelector('.panel-header .play')
   // this.$list= this.$el.querySelector('.player-footer .icon-list')
    // addEventListener的第二个参数是对象时，会自动在对象中寻找hadleEvent方法
    this.$el.addEventListener('click',this)
    //this.$list.addEventListener('click',this)
    this.$audio = this.createAudio()
    this.progressBar = new ProgressBar(this.$el.querySelector('.player-footer .progress'),this.$audio)
    this.lyricsPlayer = new LyricsPlayer(this.$el.querySelector('.lyric-box'),this.$audio)
    this.fetching = false
  }


  createAudio(){
    let audio = document.createElement('audio')
    audio.id = `player-${Math.floor(Math.random() * 100)}-${+new Date()}`
    audio.addEventListener('ended',()=>{
    //  this.$audio.play()
      this.lyricsPlayer.restart()
      this.progressBar.restart()
    })
    document.body.appendChild(audio)
    return audio 
  }

  handleEvent(e){
    let target = event.target
    switch(true){
      case target.matches('.icon-play'):
        this.onPlay(target)
        break
      case target.matches('.icon-pause'):
        this.onPause(target)
        break
      case target.matches('.icon-list'):
        this.hide()
        break
      default:break
    }
  }

  onPlay(target){
    if(this.fetching) return 
    target.classList.toggle('icon-pause')
    target.classList.toggle('icon-play')
   // this.$audio.play()
    this.progressBar.start()
    this.lyricsPlayer.start()
  }

  onPause(target){
    target.classList.toggle('icon-pause')
    target.classList.toggle('icon-play')
   // this.$audio.pause()
    this.progressBar.stop()
    this.lyricsPlayer.stop()
  }

  play(options){
    if(!options) return 
    this.$el.querySelector('.play-title .name').innerText = options.songname
    this.$el.querySelector('.play-title .author').innerText = options.artist
    this.progressBar.reset(options.duration)

    let coverUrl = `https://y.gtimg.cn/music/photo_new/T002R150x150M000${options.albummid}.jpg`
    this.$el.querySelector('.album-cover').src = coverUrl
    this.$el.querySelector('.bg-cover').style.backgroundImage = `url(${coverUrl})`

    if (options.songid) {
      if ( this.songid && (this.songid !== options.songid)) {
        this.$play.classList.toggle('icon-play')
        this.$play.classList.toggle('icon-pause')
      }
      //http://dl.stream.qqmusic.qq.com/C400003UTRfZ12wGOs.m4a?guid=6092900555&vkey=7462236AE5FD71EB74BE318D0F021B3522EF4644190BA59BB92A7C1DEEDB32A2A489200DA1FA47C5AF18698102E5995BFA5608C6D31DD186&uin=0&fromtag=38
      this.songid = options.songid
     // this.$audio.src = `http://dl.stream.qqmusic.qq.com/C100${this.songid}.m4a?fromtag=0&guid=126548448`
      this.fetching = true
      fetch(`https://qq-music-api.now.sh/lyrics?id=${this.songid}`)
        .then(res =>  res.json())
        .then(json => json.lyric)
        .then(text => this.lyricsPlayer.reset(text))
        .catch(() => {})
        .then(() => this.fetching = false)
    }
    
    this.show()
  }

  show(){
    this.$el.classList.add('show')
    document.body.classList.add('noscroll')
  }

  hide(){
    this.$el.classList.remove('show')
    document.body.classList.remove('noscroll')
  }

}


class ProgressBar {
  constructor(el,audio,duration,action){
    this.$el = el
    this.$audio = audio
    this.duration = duration || 0
    this.progress = 0
    this.currentTime = 0
    this.$currentTime = this.$el.querySelector('.current-time')
    this.$totalTime = this.$el.querySelector('.total-time')
    this.$totalBar = this.$el.querySelector('.bar')
    this.$progressBar = this.$el.querySelector('.progress-now')
    this.$currentTime.innerText = this.formatTime(this.currentTime)
    this.$totalTime.innerText = this.formatTime(this.duration)
    if(action) this.start()
  }

  start(){
    this.stop()
    this.intervalId = setInterval(this.update.bind(this),50)
  }

  stop(){
    clearInterval(this.intervalId)
  }

  update(){
    this.currentTime = Math.round(this.$audio ? this.$audio.currentTime : this.currentTime + 0.05)
    if(this.currentTime > this.duration) this.reset()
    this.progress = this.currentTime /this.duration
    this.$progressBar.style.transform = `translateX(${this.progress *100 -100}%)`
    this.$currentTime.innerText = this.formatTime(this.currentTime)
    
  }

  reset(duration){
    this.stop()
    this.currentTime = 0
    this.progress = 0
    this.$progressBar.style.transform = `translateX(-100%)`
    this.$currentTime.innerText = this.formatTime(this.currentTime)
    if(duration){
      this.duration = parseInt(duration,10)
      this.$totalTime.innerText = this.formatTime(this.duration)
    }
  }

  restart(){
    this.reset()
    this.start()
  }

  formatTime(seconds){
    let curMin = ''+Math.floor(seconds/60)
    let curSec = ''+Math.floor(seconds%60)
    curMin = (curMin.length ===1)?('0'+curMin):curMin
    curSec = (curSec.length ===1)?('0'+curSec):curSec
    return (curMin+':'+curSec)
  }
}

class LyricsPlayer{
  constructor(el,audio){
    this.$el = el
    this.$el.innerHTML = '<div class="player-lyrics-lines"></div>'
    this.$lines = this.$el.querySelector('.player-lyrics-lines')
    this.$audio = audio 
    this.text = ''
    this.lyricsArr = []
    this.currentTime = 0
    this.index = 0
    this.reset(this.text)
  }

  renderLyrics(str){
    let lyricsArr = []
    str.split('\n').forEach(function(line){     
      let times = line.match(/\d{2}:\d{2}/g)
      let str = line.replace(/\[.+?\]/g,'')
      // 有些歌词行可能为空，无法匹配得到时间
      if(Array.isArray(times) && (str != '')){
        times.forEach(function(time){
          lyricsArr.push({"time":time,"value":str})
        })
      }
    })

    lyricsArr.sort(this.byField('time'))
    console.log(lyricsArr)

    this.lyricsArr = lyricsArr

    if(lyricsArr.length){
      this.$lines.innerHTML = lyricsArr.map( (line,idx) =>`
      <div class="player-lyric line-${idx+1}">${line.value}</div>` ).join('')
    }
  }

  reset(text){
    this.stop()
    this.index = 0
    this.currentTime = 0

    this.$lines.style.transform = `translateY(0)`
    let $active = this.$lines.querySelector('.active')
    if ($active) {
      $active.classList.remove('active')
    }

    if (text) {
      this.text = this.formatText(text) || ''
      this.renderLyrics(this.text)
    }

    if (this.lyricsArr.length) {
      this.$lines.children[this.index].classList.add('active')
    }
  }

  
  start(){
    this.stop()
    this.intervalId = setInterval(this.update.bind(this),1000)
  }

  stop(){
    clearInterval(this.intervalId)
  }

  update(){
    this.currentTime = Math.round(this.$audio ? this.$audio.currentTime : this.currentTime + 1)
    if(this.index === this.lyricsArr.length-1) return this.reset()
    for(let i=this.index+1;i<this.lyricsArr.length;i++){
      let seconds = this.getSeconds(this.lyricsArr[i].time)
      //能找到匹配的时间 且 (下一个数组元素不存在或者当前时间小于下一条的时间)
      if((this.currentTime == seconds) &&
      (!this.lyricsArr[i + 1] || this.currentTime < this.getSeconds(this.lyricsArr[i + 1].time))){
        this.$lines.children[this.index].classList.remove('active')
        this.$lines.children[i].classList.add('active')
        this.index = i
        break
      }
    }
    if (this.index > 2) {
      let y = -(this.index - 2) * this.LINE_HEIGHT
      this.$lines.style.transform = `translateY(${y}px)`
    }

  }

  restart(){
    this.reset()
    this.play()
  }


  getSeconds(str){
    return str.replace(/(\d{2}):(\d{2})/,(match,p1,p2) => 60 *parseInt(p1,10)+parseInt(p2,10))
  }
  //
  formatText(str){
    let div = document.createElement('div')
    div.innerHTML = str
    return div.innerText
  }

  byField(key) {
    return function(v1,v2){
      if(v1[key]>v2[key])
        return 1
      else
        return -1
    }
  }
}

LyricsPlayer.prototype.LINE_HEIGHT = 30