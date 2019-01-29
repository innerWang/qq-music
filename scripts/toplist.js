export class Toplist{
  constructor(el){
    this.$el = el
  }

  launch(){
    fetch('https://qq-music-api.now.sh/top')
    .then( res=> res.json())
    .then(json => this.list = json.data.topList)
    .then(this.renderRank)

    return this
  }

  renderRank(originalData){
    this.$el.querySelector('.top-list-wrap').innerHTML=originalData.data.topList.map(item=>{
      return `<li class="top-item">
      <a href="#">
        <div class="item-img"><img class="lazyload" src="images/static.jpg" data-src="${item.picUrl}" alt=""></div>
        <div class="item-content">
          <div class="topic ellipsis">${item.topTitle}</div>
          ${this.createSongList(item.songList)}
          <i class="topic-arrow">></i>
        </div>
      </a>
    </li>`
    }).join('')

    lazyload(this.$el.querySelectorAll('.lazyload'))
  }

  createSongList(songs){
    return songs.map((song,idx)=>
      `<div class="song-detail ellipsis">${idx+1}
      <span class="song-name">${song.songname}</span>- ${song.singername}</div>`
    ).join('')
  }

}