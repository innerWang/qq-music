import './tapswitch.js'
import {Recommend} from './recommend.js'
import {Toplist} from './toplist.js'
import {Search} from './search.js'
import {MusicPlayer} from './player.js'

let indexOfTabChanged = false
let recommend = new Recommend(document.querySelector('#recommand-view')).launch()
let toplist = new Toplist(document.querySelector('#rank-view ')).launch()
let searchPage = new Search(document.querySelector('#search-view'))
let player = new MusicPlayer(document.querySelector('#player-panel'))
    

setInterval(function(){
  if(indexOfTabChanged){
    console.log('tab changed...')
    window.dispatchEvent(new Event('scroll'))
    indexOfTabChanged = false
  }
},100)

document.querySelector('#header .player-btn').addEventListener('click',function(){
  player.show()
})


function onHashChange(){
  let hash = location.hash
  if(/^#player-panel\?.+/.test(hash)){
    let matches = hash.slice(hash.indexOf('?')+1).match(/(\w+)=([^&]+)/g)
    let options = matches && matches.reduce((recData,curVal)=>{
      let arr = curVal.split('=')
      recData[arr[0]] = decodeURIComponent(arr[1])
      return recData 
    },{})
    player.play(options)
  }else{
    player.hide()
  }
}

onHashChange()
window.addEventListener('hashchange',onHashChange)

