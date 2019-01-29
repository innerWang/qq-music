export class Search{
  constructor(el){
    this.$el = el
    this.$input = this.$el.querySelector('#search')
    this.$btn = this.$el.querySelector('.search-btn')
    this.$songs = this.$el.querySelector('.search-song-list')
    this.keyword = ''
    this.page = 1
    this.perpage = 20
    this.songs = {}
    this.nomore = false
    this.fetching = false
    this.getTotalNum = 0
    this.$input.addEventListener('keyup',this.onKeyUp.bind(this))
    this.$btn.addEventListener('click',this.onClick.bind(this))
    this.onscroll = this.onScroll.bind(this)
    window.addEventListener('scroll',this.onscroll)
  }

  onKeyUp(event){
    let keyword = event.target.value.trim()
    if(!keyword){
      this.reset()
    }  
  }

  onClick(event){
    let keyword = this.$input.value.trim()
    if(!keyword) return this.reset()
    this.search(keyword)
  }

  search(keyword,page){
    if(keyword === '') return 
    if (this.keyword === keyword && this.songs[page || this.page]) return
    if(this.fetching) return 
    if (this.keyword !== keyword) this.reset()
    this.keyword = keyword
    this.loading()
    fetch(`https://qq-music-api.now.sh/search?keyword=${this.keyword}&page=${page || this.page}`)
      .then(res => res.json())
      .then(json =>{
        this.page = json.data.song.curpage
        this.getTotalNum += json.data.song.curnum
        this.nomore = (this.getTotalNum === json.data.song.totalnum)
        this.songs[this.page] = json.data.song.list //this.songs.push.apply(this.songs,json.data.song.list)
        return json.data.song.list
      })
      .then(songs => this.append(songs))
      .then(() => this.done())
      .catch(() => this.fetching = false)
  }

  append(songs){
    this.$songs.innerHTML += songs.map(song => { 
      let author = song.singer.map(s=>s.name).join('、')
      return `<li>
        <a href="#player-panel?artist=${author}&songid=${song.songid}&songname=${song.songname}&albummid=${song.albummid}&duration=${song.interval}">
          <i class="icon-music"></i>
          <h6 class="main-title ellipsis">${song.songname}</h6>
          <p class="sub-title ellipsis">${author}</p>
        </a>
      </li>`}).join('')
  }

  onScroll(){
    if(this.nomore) return 
 //   console.log('search-scroll....')
    if(document.documentElement.clientHeight + pageYOffset > document.body.scrollHeight-50){
      this.search(this.keyword,this.page+1)
    }
    
  }

  reset(){
    this.page = 1
    this.keyword = ''
    this.songs={}
    this.getTotalNum = 0
    this.$songs.innerHTML = '';
    this.nomore = false;
    this.$el.querySelector('.load-done').classList.add('hide')
  }

  loading(){
    this.fetching = true
    console.log('show loading....')
    this.$el.querySelector('.search-loading').classList.add('show')
  }

  done(){
    this.fetching = false
    if(this.nomore){
      this.$el.querySelector('.icon-loading').style.display = 'none'
      this.$el.querySelector('.loading').style.display = 'none'
      this.$el.querySelector('.load-done').classList.remove('hide')
      this.$el.querySelector('.search-loading').classList.add('show')
    }else {
      this.$el.querySelector('.search-loading').classList.remove('show')
    }

  }
}