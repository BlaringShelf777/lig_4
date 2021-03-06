const rand_in_range = (min, max) => Math.floor(Math.random() * (max + 1)) + min

const lig_4 = {
    player_1: '1',
    player_2: '2',
    column: 3,
    reseting: false,
    matrix: {
        path: null,
        start() {
            this.path = [...Array(6)].map( _ => [...Array(7)].map( _ => ' '))
        }
    },
    start() {
        const reset = document.querySelector('button.reset__button')
        const desktop_reset = document.querySelector('div.reset_desktop')

        this.matrix.start()
        this.animations.start()
        this.disks.start()
        this.input.start()
        this.controller.start()
        this.fullscreen.start()
        this.miniMenu.start()
        reset.addEventListener('click', this.reset.bind(this))
        desktop_reset.addEventListener('click', _ => {
            const slider = desktop_reset.children[0]

            this.animations.disk.drop_disks()
            slider.classList.add('reset_desktop_slider--animating')
            setTimeout( _ => slider.classList.remove('reset_desktop_slider--animating'), 1000)
        })
    },
    reset() {
        const cols = [...document.querySelectorAll('div.game__col')]
        const arrow = document.querySelector('i.fa-chevron-down')

        this.reseting = true
        this.input.error_id = null
        this.column = 3
        cols.forEach(col => col.innerHTML = '')
        arrow.classList.remove('fa-chevron-down-color2')
        this.controller.render(arrow)
        this.disks.start()
        this.matrix.start()
        this.win.reset()
        this.reseting = false
    },
    soundEffects: {
        singleFallingChipSound() {
            let chip = document.createElement("audio");
            if (chip.canPlayType("audio/mpeg")) {
                chip.setAttribute("src","./assets/soundEffects/single-falling-chip.mp3")
            }
        
            chip.play();
        },
        
        fallingChipsSound() {
            let chips = document.createElement("audio");
            if (chips.canPlayType("audio/mpeg")) {
                chips.setAttribute("src","./assets/soundEffects/falling-chips.mp3")
            }
    
            chips.play();
            return chips;
        },
        
        victorySound() {
            let honor = document.createElement("audio");
            if (honor.canPlayType("audio/mpeg")) {
                honor.setAttribute("src","./assets/soundEffects/victory.mp3")
            }
        
            honor.play();
        },
        
        tieSound() {
            let tie = document.createElement("audio");
            if (tie.canPlayType("audio/mpeg")) {
                tie.setAttribute("src","./assets/soundEffects/tie-music.mp3")
            }
        
            tie.play();
        }
        
    },
    miniMenu:{
        start(){
            const soundsMusic = document.getElementById('sounds');
            const bossaNova = document.getElementById('bossaNova');

            soundsMusic.addEventListener('click', _ => {
                bossaNova.classList.toggle("bossaNova");
                soundsMusic.classList.toggle('button--bar')

                if (bossaNova.classList.contains('bossaNova')) {
                    this.pauseAudio(bossaNova)
                }
                else {
                    this.playAudio(bossaNova)
                }
            });

        },
        playAudio(bossaNova) { 
            bossaNova.play(); 
        },
        
        pauseAudio(bossaNova) { 
            bossaNova.pause(); 
        }
    },
    controller: {
        start() {
            const button_area = document.querySelector('div.button_area')
            const seta = document.querySelector('i.fa-chevron-down')
            const game_area = document.querySelector('div.game_container')

            button_area.addEventListener('click', evt => {
                const evt_target = evt.target;
                let flag = false;

                if (evt_target.classList.contains('button--left')) {
                    if (lig_4.column > 0) {
                        lig_4.column -= 1;
                        flag = true;
                    }
                }
                if (evt_target.classList.contains('button--right')) {
                    if (lig_4.column < 6) {
                        lig_4.column += 1;
                        flag = true;
                    }
                }
                if (evt_target.classList.contains('button--down')) {
                    if (lig_4.disks.new_disk()) {
                        seta.classList.toggle('fa-chevron-down-color2');
                    }
                    lig_4.verify()
                }
                if (flag) {
                    this.render(seta)
                }
            })

            game_area.addEventListener('click', evt => {
                const evt_target = evt.target
                const row = evt_target.closest('div.game__col')

                if (row) {
                    lig_4.column = Number(row.id.slice(-1))
                    this.render(seta)
                    if (lig_4.disks.new_disk()) seta.classList.toggle('fa-chevron-down-color2');
                    lig_4.verify()
                }
            })
        },
        render(seta) {
            seta.style.left = `${lig_4.column * 50}px`;
        }
    },
    input: {
        error_id: null,
        get_names() {
            const inputNames = document.getElementById('inputNames');
            const submit = document.getElementById('submit');

            submit.addEventListener('click', function(){
                const jogadorUm = document.getElementById('inputUm').value;
                const jogadorDois = document.getElementById('inputDois').value;

                if (
                    jogadorUm.trim() !== '' 
                    && 
                    jogadorDois.trim() !== ''
                    &&
                    jogadorUm.trim() !== jogadorDois.trim()) {    
                    const playernameOne = document.querySelector('div.player__name--one');
                    const playernameTwo = document.querySelector('div.player__name--two');
                    const container = document.querySelector("div.container");
                    const reset_button = document.querySelector('button.reset__button')

                    playernameOne.innerText = jogadorUm;
                    playernameTwo.innerText = jogadorDois;
                    inputNames.classList.add('hidden');
                    container.classList.remove('hidden');
                    reset_button.classList.remove('hidden')

                } else {
                    const error = document.querySelector('p.input__error_msg')

                    error.classList.remove('input__error_msg-hidden')
                    clearTimeout(this.error_id)
                    this.error_id = setTimeout( _ => error.classList.add('input__error_msg-hidden'), 2500)
                }
            })
        },
        start() {
            this.get_names()
        }
    },
    fullscreen: {
        start(){
            function toggleFullScreen() {
                if (!document.fullscreenElement &&    
                    !document.mozFullScreenElement && 
                    !document.webkitFullscreenElement && 
                    !document.msFullscreenElement ) {  
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
                } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                }
            }
            const buttonFullscreen = document.querySelector("#fullscreen");
            buttonFullscreen.addEventListener("click", function() {
                toggleFullScreen();
            });
        }
    },
    animations: {
        buttons: {
            start() {
                const buton_area = document.querySelector('div.button_area')
                
                buton_area.addEventListener('click', evt => {
                    const evt_target = evt.target

                    // Animate down
                    if (evt_target.classList.contains('button--down')) {
                        evt_target.classList.add('animate--down')
                        setTimeout( _ => evt_target.classList.remove('animate--down'), 300)
                    }

                    // Animate left
                    else if (evt_target.classList.contains('button--left')) {
                        evt_target.classList.add('animate--left')
                        setTimeout( _ => evt_target.classList.remove('animate--left'), 300)
                    }

                    // Animate right
                    else if (evt_target.classList.contains('button--right')) {
                        evt_target.classList.add('animate--right')
                        setTimeout( _ => evt_target.classList.remove('animate--right'), 300)
                    }
                })
            }
        },
        disk: {
            animate(disk, final_position) {
                setTimeout( _ => {
                    disk.style.top = `${47 * final_position + 40}px`
                })
                setTimeout( _ => {
                    disk.classList.remove('player__disk--animating')
                    disk.style.top = `${0}px`
                }, 500)
            }, 
            async drop_disks() {
                let cols = [...document.querySelectorAll('div.game__col')].map(col => [...col.children].filter(el => el.classList.contains('player__disk')))
                let total_el = 0
                const len = cols.length

                if (!lig_4.reseting) {
                    let fall = lig_4.soundEffects.fallingChipsSound()
                    let chipsStore = setInterval(() => {
                        fall = lig_4.soundEffects.fallingChipsSound()
                    }, 1000)
                    lig_4.reseting = true
                    lig_4.win.has_winner = false
                    for (let i = 0; i < len; i++) {
                        const col = cols[i]

                        for (let j = 0; j < col.length; j++) {
                            const el = col[j]
                            total_el++

                            el.style.top = `${47 * (5 - j) + 40}px`
                            el.style.left = '50%'
                            el.style.position = 'absolute'
                            el.style.transform = 'translate(-50%, 0)'
                        }
                    }

                    for (let i = 0; i < len; i++) {
                        const index = rand_in_range(0, cols.length - 1)
                        const col = cols[index]

                        for (let j = 0; j < col.length; j++) {
                            const el = col[j]

                            setTimeout( _ => el.classList.add('player__disk--animating--drop'))
                            await new Promise(r => setTimeout(r, 100))
                        }
                        cols.splice(index, 1)
                    }
                    await new Promise(r => setTimeout(r, (total_el - 1) / 2 * 3 + 1000 * (total_el >= 1)))
                    clearInterval(chipsStore)
                    fall.pause()
                    lig_4.reset()
                }
            }
        },
        start() {
            this.buttons.start()
        }
    },
    disks: {
        start() {
            const columns = [...document.querySelectorAll('div.game__col')]
            
            columns.forEach( (col, i) => {
                const container = document.createElement('div')
                const index = document.createElement('p')
                
                index.innerText = i + 1
                container.appendChild(index)
                container.classList.add('blank_container')
                for (let j = 0; j < 6; j++) {
                    const el = document.createElement('div')

                    el.classList.add('disk--blank')
                    if (container.children.length === 6) 
                        el.classList.add('disk--blank--first')
                    container.appendChild(el)
                }
                col.innerHTML = ''
                col.appendChild(container)
            })
        },
        new_disk() {
            const col = document.querySelector(`div#col_${lig_4.column}`)
            const seta = document.querySelector('i.fa-chevron-down')
            let y_axis = 0

            if (col.children.length < 6 + 1 && !lig_4.reseting && !lig_4.win.has_winner) {
                const disk = document.createElement('div')
                let cur_player = '1'

                disk.classList.add('player__disk')
                if (seta.classList.contains('fa-chevron-down-color2')) {
                    disk.classList.add('player__disk--two')
                    cur_player = '2'
                }
                disk.classList.add('player__disk--animating')
                col.appendChild(disk)
                
                while (y_axis < 6) {
                    if (lig_4.matrix.path[y_axis][lig_4.column] !== ' ') break
                    y_axis++
                }
                lig_4.matrix.path[--y_axis][lig_4.column] = cur_player
                lig_4.animations.disk.animate(disk, y_axis)
                setTimeout(() => {lig_4.soundEffects.singleFallingChipSound();}, 500)

                return true
            }

            return false
        }
    },
    verify() {    
        let array = lig_4.matrix.path
        let won = false;
        let player = {
            name: null,
            two: false
        }

        if (!this.reseting)
        {    
            // Horizontal
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length - 3; j++) {
                    if (array[i][j] !== " "
                        &&
                        array[i][j] === array[i][j+1]
                        &&
                        array[i][j] === array[i][j+2]
                        &&
                        array[i][j] === array[i][j+3]){
                        won = true;
                        if(array[i][j] === '1') {
                            player.name = document.getElementById('inputUm').value;
                        }
                        else {
                            player.name = document.getElementById('inputDois').value;
                            player.two = true
                        }
                    }
                }
            }
            // Vertical
            for (let i = 0; i < array.length - 3; i++) { 
                for (let j = 0; j < array[i].length; j++) {
                    if (array[i][j] !== " "
                        &&
                        array[i][j] === array[i+1][j]
                        &&
                        array[i][j] === array[i+2][j]
                        &&
                        array[i][j] === array[i+3][j]){
                        won = true;
                        if(array[i][j] === '1') {
                            player.name = document.getElementById('inputUm').value;
                        }
                        else {
                            player.name = document.getElementById('inputDois').value;
                            player.two = true
                        }
                    }
                } 
            }
            //Diagonal p/ baixo
            for (let i = 0; i < array.length - 3; i++) { 
                for (let j = 0; j < array[i].length - 2; j++) {

                    if (array[i][j] !== " "
                        &&
                        array[i][j] === array[i+1][j+1]
                        &&
                        array[i][j] === array[i+2][j+2]
                        &&
                        array[i][j] === array[i+3][j+3]){ 
                        won = true; 
                        if(array[i][j] === '1') {
                            player.name = document.getElementById('inputUm').value;
                        }
                        else {
                            player.name = document.getElementById('inputDois').value;
                            player.two = true
                        }
                    }
                }
            }
            //Diagonal p/ cima
            for (let i = array.length - 2; i < array.length; i++) { 
                for (let j = 0; j < array[i].length - 3; j++) {

                    if (array[i][j] !== " "
                        &&
                        array[i][j] === array[i-1][j+1]
                        &&
                        array[i][j] === array[i-2][j+2]
                        &&
                        array[i][j] === array[i-3][j+3]){
                        won = true; 
                        if(array[i][j] === '1') {
                            player.name = document.getElementById('inputUm').value;
                        }
                        else {
                            player.name = document.getElementById('inputDois').value;
                            player.two = true
                        }
                    }
                }
            }
        }

        if (!won) {
            const cols = [...document.querySelectorAll('div.game__col')].map(col => col.children).filter(col => col.length !== 7)

            if (!cols.length) {
                this.win.set_winner(false, false, true)
            }
        } else this.win.set_winner(player.name, player.two)
    },
    win: {
        has_winner: false,
        set_winner(player_name, player_two=false, tie=false) {
            const victory = document.querySelector('div.message_area');
            const conquer = document.createElement('div');
            let bah
   
            conquer.classList.add('invictus');
            if (player_name) conquer.innerText = `${player_name} venceu!`;
            if (player_two) conquer.classList.add('invictus2')
            if ((player_name || player_two) && !this.has_winner) bah = lig_4.soundEffects.victorySound()
            if (tie && !this.has_winner) {
                conquer.innerText = 'Empate!'
                conquer.style.backgroundColor = "#F44336"
                bah = lig_4.soundEffects.tieSound()
            }
            if (!this.has_winner) {
                victory.innerHTML = ''
                victory.appendChild(conquer);
                victory.classList.remove('hidden')
                setTimeout( _ => {
                    victory.classList.add('hidden')
                }, 4500)
            }

            this.has_winner = true
        },
        reset() {
            this.has_winner = false
        }
    }
}

lig_4.start()


