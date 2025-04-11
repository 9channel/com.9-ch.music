<!-- 空白div占位400*300 -->
<script lang="ts">
interface Configs {
    bpm: number;
    timeSig: number;
    volume: number;
    isFullScreen: boolean;
    soundFreq: number;
    beatSeqLen: number;
    beatSeq: number[];
    forceScreenOn: boolean;
}
import Slider from '@/component/common/Slider.vue'
import BeatBlock from '@/component/music/BeatBlock.vue'
import NoSleep from 'nosleep.js';
export default {
    components: {
        Slider, BeatBlock
    },
    data() {
        return {
            configs: <Configs>({
                bpm: 120,
                timeSig: 4,
                soundFreq: 880,
                volume: 20,
                isFullScreen: false,
                beatSeqLen: 4,
                beatSeq: [3, 1, 1, 1],
                forceScreenOn: false,
            }),
            audioCtx: null as AudioContext | null,
            scheduler: null as number | null,
            currentIndex: 0,
            beatBlocks: [] as HTMLElement[],
            noSleep: new NoSleep(),
        }
    },
    methods: {
        saveCfg() {
            console.log('saveCfg', this.configs)
            const isPlaying = this.scheduler !== null
            if (isPlaying) {
                this.stopPlay()
            }
            localStorage.setItem('cfg-metronome', JSON.stringify(this.configs))
            if (isPlaying) {
                this.startPlay()
            }
        },
        resetCfg() {
            console.log('resetCfg');
            localStorage.removeItem('cfg-metronome')
            window.location.reload()
        },
        changeFullScreen() {
            this.saveCfg()
            window.location.reload()
        },
        changeForceScreenOn() {
            this.saveCfg()
            window.location.reload()
        },
        changeBeatSeq(value: number) {
            console.log('changeBeatSeq', value)
            const oldLen = this.configs.beatSeqLen
            this.configs.beatSeqLen = value
            const oldSeq = this.configs.beatSeq
            this.configs.beatSeq = []
            for (let i = 0; i < this.configs.beatSeqLen; i++) {
                const newValue = i < oldLen ? oldSeq[i] : 1
                this.configs.beatSeq.push(newValue)
            }
            this.saveCfg()
        },
        changeBeatSeqItem(index: number, value: number) {
            if (this.scheduler !== null) {
                this.stopPlay()
            }
            console.log('changeBeatSeqItem', index, value)
            this.configs.beatSeq[index] = value
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
            }
            const time = this.audioCtx.currentTime
            this.playSound(this.audioCtx, value, time, 0.2)
            this.saveCfg()
        },
        changeSoundFreq(value: number) {
            console.log('changeSoundFreq', value)
            this.configs.soundFreq = value
            this.saveCfg()
        },
        changeBpm(value: number) {
            console.log('changeBpm', value)
            this.configs.bpm = value
            this.saveCfg()
        },
        changeVolume(value: number) {
            console.log('changeVolume', value)
            this.configs.volume = value
            this.saveCfg()
        },
        getName(bpm: number) {
            if (bpm < 24) {
                return 'Larghissimo'
            } else if (bpm < 40) {
                return 'Grave'
            } else if (bpm < 60) {
                return 'Largo'
            } else if (bpm < 66) {
                return 'Larghetto'
            } else if (bpm < 77) {
                return 'Adagio'
            } else if (bpm < 109) {
                return 'Andante'
            } else if (bpm < 121) {
                return 'Moderato'
            } else if (bpm < 169) {
                return 'Allegro'
            } else if (bpm < 200) {
                return 'Presto'
            } else {
                return 'Prestissimo'
            }
        },
        playSound(ctx: AudioContext, type: number, time: number, delay: number) {
            // 0: Rest, 1: Weak, 2: Medium, 3: Strong
            // 0:  0, 1: 1, 2: 2^(2/12), 3: 2^(4/12)
            const volume = this.configs.volume / 100
            let rate = 1
            if (type === 0) {
                rate = 0
            } else if (type === 1) {
                rate = 1
            } else if (type === 2) {
                rate = 2 ** (2 / 12)
            } else if (type === 3) {
                rate = 2 ** (4 / 12)
            }
            const soundFreq = this.configs.soundFreq * rate;
            const osc = ctx.createOscillator()
            const gainNode = ctx.createGain()
            osc.frequency.value = soundFreq
            if (type === 0) {
                gainNode.gain.value = 0
            } else {
                gainNode.gain.value = volume
                gainNode.gain.linearRampToValueAtTime(volume, time + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
            }
            osc.connect(gainNode)
            gainNode.connect(ctx.destination)
            osc.start()
            osc.stop(time + delay)

        },
        startPlay() {
            console.log('startPlay', this.configs.bpm)
            if (this.scheduler) {
                this.stopPlay()
            }
            this.currentIndex = 0
            // init scheduler
            const interval = 60000 / this.configs.bpm
            // load from beatTunner 
            this.beatBlocks = []
            const beatTunner = document.getElementById('beatTunner')
            if (beatTunner) {
                const beatBlocks = beatTunner.getElementsByClassName('beatblock')
                for (let i = 0; i < beatBlocks.length; i++) {
                    const block = beatBlocks[i] as HTMLElement
                    this.beatBlocks.push(block)
                }
            }
            this.scheduler = setInterval(() => {
                if (!this.audioCtx) {
                    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
                }
                const time = this.audioCtx.currentTime
                if (this.currentIndex >= this.configs.beatSeq.length) {
                    this.currentIndex = 0
                }
                const type = this.configs.beatSeq[this.currentIndex]
                // highlight the block
                for (let i = 0; i < this.beatBlocks.length; i++) {
                    const block = this.beatBlocks[i]
                    if (i === this.currentIndex) {
                        block.classList.add('active')
                    } else {
                        block.classList.remove('active')
                    }
                }
                this.playSound(this.audioCtx, type, time, 0.2)
                this.currentIndex++
            }, interval)
        },
        stopPlay() {
            // stop play
            console.log('stopPlay')
            if (this.scheduler) {
                clearInterval(this.scheduler)
                this.scheduler = null
            }
            this.currentIndex = 0
            if (this.audioCtx) {
                this.audioCtx.close()
                this.audioCtx = null
            }
            // remove highlight
            for (let i = 0; i < this.beatBlocks.length; i++) {
                const block = this.beatBlocks[i]
                block.classList.remove('active')
            }
            this.beatBlocks = []
        },
        switchPlay() {
            console.log('switchPlay')
            if (this.scheduler) {
                this.stopPlay()
            } else {
                this.startPlay()
            }
        }
    },
    beforeMount() {
        let cfg = localStorage.getItem('cfg-metronome')
        if (cfg) {
            this.configs = JSON.parse(cfg)
        }
    },
    mounted() {
        if (this.configs.isFullScreen) {
            const app = document.getElementById('app')
            if (app) {
                const header = app.getElementsByTagName('header')[0]
                if (header) {
                    header.style.display = 'none'
                }
                const footer = app.getElementsByTagName('footer')[0]
                if (footer) {
                    footer.style.display = 'none'
                }
                const infos = document.getElementById('infos')
                if (infos) {
                    infos.style.display = 'none'
                }
            }
        }
        const lang = navigator.language
        if (lang.startsWith('zh')) {
            const zh = document.getElementById('zh-CN')
            if (zh) {
                zh.style.display = 'block'
            }
        } else {
            const en = document.getElementById('en-US')
            if (en) {
                en.style.display = 'block'
            }
        }
        localStorage.setItem('latestRoute', '/metronome')
        // nosleep
        if (this.configs.forceScreenOn) {
            const enableNoSleep = () => {
                document.removeEventListener('click', enableNoSleep, false)
                this.noSleep.enable()
            }
            document.addEventListener('click', enableNoSleep, false)
        }
    },
}
</script>
<template>
    <div id="mainDiv">
        <div id="beatTunner">
            <div v-for="(item, index) in configs.beatSeq" :key="index">
                <BeatBlock :index="index" :initValue="item" @change="changeBeatSeqItem" />
            </div>
        </div>
        <div id="speedName">
            <h2>{{ getName(configs.bpm) }}</h2>
        </div>
        <div id="controls">
            <div id="controlBtns">
                <button @click="switchPlay" :class="['btn', scheduler !== null ? 'btnStop' : 'btnStart']">
                    {{ scheduler !== null ? 'Stop' : 'Start' }}
                </button>
                <button @click="resetCfg">Reset</button>
            </div>
            <div>
                <label for="bpm">BPM</label>
                <div>
                    <Slider :initValue=configs.bpm :min=1 :max=300 :threshold=10 @change="changeBpm" />
                </div>
            </div>
            <div>
                <label for="timeSig">Per measure</label>
                <div class="flexVertical">
                    <Slider :initValue=configs.beatSeqLen :min=1 :max=32 :threshold=20 @change="changeBeatSeq" />
                </div>
            </div>
            <div>
                <label for="soundFreq">Frequency</label>
                <div>
                    <Slider :initValue=configs.soundFreq :min=20 :max=20000 :threshold=5 @change="changeSoundFreq" />
                    <span>Hz</span>
                </div>
            </div>
            <div>
                <label for="volume">Volume</label>
                <div>
                    <Slider :initValue=configs.volume :min=0 :max=100 :threshold=10 @change="changeVolume" />
                    <span>%</span>
                </div>
            </div>
            <div id="fullScreenControl">
                <label for="fullScreen">Full Screen</label>
                <div class="ctlCheckboxDiv">
                    <input type="checkbox" id="fullScreenInput" v-model="configs.isFullScreen"
                        @change="changeFullScreen" />
                </div>
            </div>
            <div id="forceScreenOnControl">
                <label for="forceScreenOn">Force Screen On</label>
                <div class="ctlCheckboxDiv">
                    <input type="checkbox" id="forceScreenOnInput" v-model="configs.forceScreenOn"
                        @change="changeForceScreenOn" />
                </div>
            </div>
        </div>
        <div id="infos">
            <div id="zh-CN" style="display: none;">
                <h3>如何使用:</h3>
                1. 点击方块可以改变节拍类型（休止、弱拍、次强拍、强拍）<br />
                2. 左右滑动调整节拍速度, 每小节拍数, 基础频率, 音量<br />
                3. 本页面支持PWA离线使用, 可以添加到桌面, 以类似App的方式使用<br />
                4. 为了避免移动设备锁屏导致节拍器停止, 可以开启强制屏幕常亮功能<br />
            </div>
            <div id="en-US" style="display: none;">
                <h3>How to use:</h3>
                1. Click on the block to change the beat type (Rest, Weak, Medium, and Strong)<br />
                2. Slide left and right to adjust the BPM, beats per measure, base frequency, and volume<br />
                3. This page supports PWA offline use, and can be added to the desktop for use like an app<br />
                4. To avoid the metronome stopping due to screen lock on mobile devices, you can enable the force screen on feature<br />
            </div>
        </div>
    </div>
</template>
<style scoped>
#mainDiv {
    max-width: 500px;
    width: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 18px;
}

#speedName {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    margin: 20px;
}

/* 类table布局, label, div 左对齐相同位置 */
#controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    margin: 20px;
}


#controls div {
    width: 100%;
    display: flex;
    margin: 5px;
}

#controls div label {
    width: 30%;
    text-align: left;
    margin: auto 0px;
}

#controls div div {
    margin: 0px;
    width: 70%;
}

#controls div div div {
    width: 100%;
}

#controls div div span {
    width: 0px;
    margin: auto -30px;
    /* 点击穿透 */
    pointer-events: none;
}

.flexVertical {
    flex-direction: column;
    justify-content: center;
    align-items: left;
}

#beatTunner {
    /* 每行最多4个 */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
}

#controlBtns {
    display: flex;
    justify-content: space-evenly;
}

#controlBtns button {
    width: 100px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px solid #000000;
    cursor: pointer;
    font-size: 20px;
}

#controlBtns button:hover {
    background-color: #0085f2;
    color: #ffffff;
}

#controlBtns button.btnStop {
    background-color: #ff0000;
    color: #ffffff;
}

.ctlCheckboxDiv {
    width: 30% !important;
}

#fullScreenControl label,
#forceScreenOnControl label {
    width: 50% !important;
}

#fullScreenInput,
#forceScreenOnInput {
    width: 24px;
    height: 24px;
    background-color: #ffffff;
    cursor: pointer;
    margin: auto;
}

#infos {
    font-size: 10px;
}
</style>