        const $= document.querySelector.bind(document)
        const $$= document.querySelectorAll.bind(document)
        
        const PLAY_STORAGE_KEY = 'ZING'

        const player =$('.player')
        const cd = $('.cd')
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playBtn=$('.btn-toggle-play')
        const progress=$('#progress')
        const nextBtn=$('.btn-next')
        const prevBtn=$('.btn-prev')
        const randomBtn=$('.btn-random')
        const repeatBtn=$('.btn-repeat')
        const playlist=$('.playlist')

        const app={
            currentIndex:0,
            isPlaying:false,
            isRandom: false,
            isRepeat:false,
            config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
            songs:[
                {
                    name:'Faded love',
                    singer:'TÙNG MIKE',
                    path:'./lyric/song3.mp3',
                    image:'./img/i3.jpg'
                },
                {
                    name:'Face',
                    singer:'Nuest Duzme',
                    path:'./lyric/song2.mp3',
                    image:'./img/i2.jpg'
                },
                {
                    name:'Lửng và ler',
                    singer:'MASEW x BRAY',
                    path:'./lyric/song9.mp3',
                    image:'./img/i9.jpg'
                },
                {
                    name:'Khuất lối ',
                    singer:'H Kray',
                    path:'./lyric/song1.mp3',
                    image:'./img/i1.jpg'
                },
                {
                    name:'Kì vọng sai lầm',
                    singer:'Audio lyric',
                    path:'./lyric/song7.mp3',
                    image:'./img/i7.jpg'
                },
                {
                    name:'Ngôi nhà hoa hồng',
                    singer:'BIBO',
                    path:'./lyric/song10.mp3',
                    image:'./img/i10.jpg'
                },
                {
                    name:'Symphony',
                    singer:'Clean Bandit',
                    path:'./lyric/song13.mp3',
                    image:'./img/i13.jpg'
                },
                {
                    name:'Echo',
                    singer:'Alexander Stewart',
                    path:'./lyric/song5.mp3',
                    image:'./img/i5.jpg'
                },
                {
                    name:'Somewhere only we know',
                    singer:'Rhianne',
                    path:'./lyric/song15.mp3',
                    image:'./img/i15.jpg'
                },
                {
                    name:'Sao em lại tắt máy',
                    singer:'Phạm Nguyên Ngọc',
                    path:'./lyric/song11.mp3',
                    image:'./img/i11.jpg'
                },
                {
                    name:'3107 2',
                    singer:'DuongG x Nâu x Wn x Freak D',
                    path:'./lyric/song6.mp3',
                    image:'./img/i6.jpg'
                },
                {
                    name:'Rồi ta sẽ ngắm pháo hoa cùng nhau',
                    singer:'O.lew',
                    path:'./lyric/song8.mp3',
                    image:'./img/i8.jpg'
                },
                {
                    name:'Ta là của nhau',
                    singer:'Đông Nhi x Ông Cao Thắng',
                    path:'./lyric/song12.mp3',
                    image:'./img/i12.jpg'
                },
                {
                    name:'Gặp em đúng lúc',
                    singer:'Luân Tang',
                    path:'./lyric/song14.mp3',
                    image:'./img/i14.jpg'
                },
                {
                    name:'Là anh',
                    singer:'Mộng nhiên',
                    path:'./lyric/song4.mp3',
                    image:'./img/i4.jpg'
                }
            ],
            
            setConfig: function(key,value){
                this.config[key]=value
                localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
            },

            render: function(){
                const htmls=this.songs.map((song,index) =>{
                    return `
                        <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                })
                playlist.innerHTML=htmls.join('')
            },

            handleEvents: function(){
                const _this = this 
                const cdWidth = cd.offsetWidth
                
                // xử lý cd quay / dừng
                const cdThumbAnimate=cdThumb.animate([
                    {
                        transform: 'rotate(360deg)'
                    }
                ],{
                    duration: 10000, // 10s
                    iterations: Infinity
                })

                cdThumbAnimate.pause()

                // xử lý phóng to / thu nhỏ cd
                document.onscroll=function(){
                    const scrollTop = window.scrollY || document.documentElement.scrollTop
                    const newWidth = cdWidth -scrollTop
                    cd.style.width=newWidth>0 ? newWidth+'px' : 0
                    cd.style.opacity=newWidth/cdWidth
                }

                //xử lý khi click
                playBtn.onclick= function(){
                    if(_this.isPlaying){
                        audio.pause()
                    }else{
                        audio.play()
                    }
                }

                //xử lý khi bài hát đang mở
                audio.onplay = function(){
                    _this.isPlaying=true
                    player.classList.add('playing')
                    cdThumbAnimate.play()

                }

                //xử lý khi bài hát đang tắt
                audio.onpause = function(){
                    _this.isPlaying=false
                    player.classList.remove('playing')
                    cdThumbAnimate.pause()
                }

                //xử lý khi tiến độ bài hát thay đôi
                audio.ontimeupdate = function(){
                    if(audio.duration){
                        const progressPercent= Math.floor(audio.currentTime/ audio.duration *100)
                        progress.value=progressPercent
                    }
                }

                // xử lí tua 
                progress.onchange= function(e){
                    const seekTime = audio.duration/100 * e.target.value
                    audio.currentTime= seekTime
                }

                //xử lí khi next bài
                nextBtn.onclick= function(){
                    if(_this.isRandom){
                        _this.playRandomSong()
                    }else{
                        _this.nextSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }

                //xử lí khi prev bài
                prevBtn.onclick= function(){
                    if(_this.isRandom){
                        _this.playRandomSong()
                    }else{
                        _this.prevSong()
                    }
                    audio.play()
                    _this.render()
                    _this.scrollToActiveSong()
                }

                //xử lí bật/ tắt random bài hát
                randomBtn.onclick= function(e){
                    _this.isRandom= !_this.isRandom
                    _this.setConfig('isRandom', _this.isRandom)
                    randomBtn.classList.toggle('active', _this.isRandom)
                }

                // xử lý lặp lại 1 bài
                repeatBtn.onclick= function(e){
                    _this.isRepeat= !_this.isRepeat
                    _this.setConfig('isRepeat', _this.isRepeat)
                    repeatBtn.classList.toggle('active', _this.isRepeat)
                }

                // xử lý next bài khi kết thúc
                audio.onended =function(){
                    if(_this.isRepeat){
                        audio.play()
                    }else{
                        nextBtn.click()
                    }
                }

                // xử lý khi click vào 1 bài hát
                playlist.onclick = function(e){
                    const songNode= e.target.closest('.song:not(.active)')
                    if(songNode|| e.target.closest('.option')){
                        if(songNode){
                            _this.currentIndex=Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            _this.render()
                            audio.play()
                        }
                    }
                }
               
            },
            
            defineProperties(){
                Object.defineProperty(this,'currentSong',{
                    get: function(){
                        return this.songs[this.currentIndex]
                    }
                })
            },

            loadCurrentSong: function(){
                heading.textContent= this.currentSong.name
                cdThumb.style.backgroundImage=`url('${this.currentSong.image}')`
                audio.src=this.currentSong.path
            },

            scrollToActiveSong: function(){
                setTimeout(()=>{
                    $('.song.active').scrollIntoView({
                        behavior:'smooth',
                        block:'nearest'
                    })

                },300) 
            },

            loadConfig: function(){
                this.isRandom=this.config.isRandom
                this.isRepeat=this.config.isRepeat
            },

            nextSong: function(){
                this.currentIndex ++
                if(this.currentIndex>= this.songs.length){
                    this.currentIndex=0
                }
                this.loadCurrentSong()
            },

            prevSong: function(){
                this.currentIndex --
                if(this.currentIndex < 0){
                    this.currentIndex= this.songs.length -1
                }
                this.loadCurrentSong()
            },

            playRandomSong: function(){
                let newIndex
                do{
                    newIndex= Math.floor(Math.random()* this.songs.length)
                }while(this.currentIndex === newIndex)
                this.currentIndex=newIndex
                this.loadCurrentSong()
            },

            start: function(){
                this.loadConfig() //gán cấu hình từ config vào ứng dụng
                this.defineProperties() // định nghĩa các thuộc tính cho object
                this.handleEvents() // lắng nghe xử lý các sự kiện 
                this.loadCurrentSong() //Tải thông tin bài hát đầu tiên
                this.render() // render playlist
                randomBtn.classList.toggle('active', this.isRandom) // hiển thị trạng thái ban đầu
                repeatBtn.classList.toggle('active', this.isRepeat)
            }
        }
        app.start()