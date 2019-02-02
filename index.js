const pomodoroClock = function() {

    const pomodoro = document.getElementById('pomodoro');
    const canvas = document.getElementById('circularLoader');
    const time = document.getElementById('time-box');
    const bottom = document.getElementById('bottom-box');    
    const sound = document.getElementById('myAudio');
    const play = document.getElementById('play');
    const pause = document.getElementById('pause');
    const settings = document.getElementById("settings-button");
    const openSide = document.getElementById("mySidenav");
    const closeButton = document.querySelector(".closebtn");
    const sideNavPomoIndex = document.getElementById('currentPomoTime');
    const sideNavRestIndex = document.getElementById('currentRestTime');
    const morePomo = document.getElementById('morePomo');
    const lessPomo = document.getElementById('lessPomo');
    const moreRest = document.getElementById('moreRest');
    const lessRest = document.getElementById('lessRest');
    const message = document.getElementById('message');

    let running = false;
    let stopped = false;
    let count = 0;

    const pomoWork = {
      time: 300,
      number: 300
    }
    const pomoRest = {
      time: 120,
      number: 120
    }
    

    // drawing the circular bar
    const ctx = canvas.getContext('2d');
    let al = 1;
    const start = 4.72;
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    let diff;

    function progressSim(value) {
        diff = ((al / value) * Math.PI * 2 * 10).toFixed(2);
        ctx.clearRect(0, 0, cw, ch);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(cw/2 +1, ch/2 +1 , 70, start, diff / 10 + start, false);
        ctx.stroke();
        al++;
    }

    function clockTime(value) {
        let minutes = parseInt(((value / 60) < 10) ? '0' + (value / 60).toString() : (value / 60).toString());
        let seconds = ((value % 60) < 10) ? '0' + (value % 60).toString() : (value % 60).toString();
        return `${minutes} : ${seconds}`
    }

    function timer() {
        if (running === true) {
            return false;
        }
        running = true;
        canvas.style.border = "none";
        message.style.display = "block";
        if (this.time >= 0 || stopped === true) {
            this.interval = setInterval(() => {
                progressSim(this.number);
                this.time--
                time.innerHTML = clockTime(this.time);
                if (this.time === 0) {
                    count++;
                    clearInterval(this.interval);
                    running = false;
                    this.time = this.number;
                    sound.play();
                    if (count % 2 !== 0) {
                        const image = document.createElement("img");
                        image.setAttribute("src", "https://odonno.gallerycdn.vsassets.io/extensions/odonno/pomodoro-code/0.2.1/1474455545331/Microsoft.VisualStudio.Services.Icons.Default");
                        bottom.appendChild(image);               
                        message.innerHTML = "rest time"; 
                        time.innerHTML = clockTime(pomoRest.number);
                        timer.call(pomoRest)
                    } else {                                            
                        time.innerHTML = clockTime(pomoWork.number);
                        message.innerHTML = "work time"; 
                        timer.call(pomoWork)
                    }
                    al = 1;
                }
            }, 1000)
        }
    };

    function stop() {
        stopped = true;
        clearInterval(this.interval);
        delete this.interval;
    };

    function resume() {
        running = false;
        stopped = false;
        if (!this.interval) {
            timer.call(this)
        };
    };

    function currentChanges(number, place) {
        let x = place.querySelector("h1")
        x.innerHTML = clockTime(number);
        time.innerHTML = clockTime(number);
    };

    function add(place) { 
      
        running = false
        this.number += 60;
        this.time = this.number;
        currentChanges(this.number, place)
        stop.call(this)
        progressSim(0)
        al=1;
    };

    function remove(place) {
        if (this.time > 60) {
            this.number -= 60;
            this.time = this.number;
            currentChanges(this.time, place);
            stop.call(this)
            progressSim(0)
            al=1;
        } else { alert("nope") }
    };

    function openNav() {
        openSide.style.height = "100%";
        openSide.style.zIndex = 15;
    };

    function closeNav() {
        openSide.style.height = "0";
        openSide.style.zIndex = 1;
    };

    settings.addEventListener("click", openNav);
    closeButton.addEventListener("click", closeNav);
    morePomo.addEventListener("click", () =>  add.call(pomoWork, sideNavPomoIndex) );
    moreRest.addEventListener("click", () => add.call(pomoRest, sideNavRestIndex) );
    lessPomo.addEventListener("click", () => remove.call(pomoWork, sideNavPomoIndex) );
    lessRest.addEventListener("click", () => remove.call(pomoRest, sideNavRestIndex) );

    play.addEventListener("click", function() {

         if (count % 2 !== 0) {           
              stopped ? resume.call(pomoRest) : timer.call(pomoRest) 
         } 
         else if (count % 2 === 0) { 
             stopped ? resume.call(pomoWork) : timer.call(pomoWork) 
         }
    });

    pause.addEventListener("click", function() {
       
            if (count % 2 !== 0) {                 
               stop.call(pomoRest)
              }
            else if (count % 2 === 0) { 
               stop.call(pomoWork)
              }
    });

    time.innerHTML = count % 2 !==0 ? clockTime(pomoRest.time) : clockTime(pomoWork.time) ;

}();