<script lang="ts">
export default {
    props: {
        initValue: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        mode: {
            type: Number,
            default: 0 // 0: +/- 1: ratio
        },
        step: {
            type: Number,
            default: 1
        },
        threshold: {
            type: Number,
            default: 40
        }
    },
    data() {
        return {
            value: this.initValue,
            startX: 0,
            isPc: false,
        };
    },
    methods: {
        leftSlide() {
            const oldValue = parseInt(this.value as any);
            const step = parseInt(this.step as any);
            if (this.mode === 0) {
                this.value = oldValue - step;
            } else {
                this.value = parseInt((oldValue / step) as any);
            }
            if (this.value < this.min) {
                this.value = this.min;
            }
        },
        rightSlide() {
            const oldValue = parseInt(this.value as any);
            const step = parseInt(this.step as any);
            if (this.mode === 0) {
                this.value = oldValue + step;
            } else {
                this.value = parseInt((oldValue * step) as any);
            }
            if (this.value > this.max) {
                this.value = this.max;
            }
        },
        handleTouchStart(event: TouchEvent | MouseEvent) {
            this.startX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;

            document.addEventListener(this.isPc ? 'mousemove' : 'touchmove', this.handleTouchMove, { passive: true });
            document.addEventListener(this.isPc ? 'mouseup' : 'touchend', this.handleTouchEnd, { passive: true });
        },
        handleTouchMove(event: TouchEvent | MouseEvent) {
            const touch = event instanceof MouseEvent ? event : event.touches[0];
            const deltaX = touch.clientX - this.startX;
            if (Math.abs(deltaX) > this.threshold) {
                if (deltaX > 0) {
                    this.rightSlide();
                } else {
                    this.leftSlide();
                }
                this.startX = touch.clientX;
            }
        },
        handleTouchEnd() {
            document.removeEventListener(this.isPc ? 'mousemove' : 'touchmove', this.handleTouchMove);
            document.removeEventListener(this.isPc ? 'mouseup' : 'touchend', this.handleTouchEnd);
            this.$emit('change', this.value);
        },
    },
    mounted() {
        const isPC = () => {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  //判断用户代理头信息
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) != -1) { flag = false; break; }
            }
            return flag;
        }
        this.isPc = isPC();
        const slider = this.$el.querySelector('.slider div') as HTMLElement;
        slider.addEventListener(this.isPc ? 'mousedown' : 'touchstart', this.handleTouchStart, { passive: true });
    },
    beforeDestroy() {
        const slider = this.$el.querySelector('.slider div') as HTMLElement;
        slider.removeEventListener(this.isPc ? 'mousedown' : 'touchstart', this.handleTouchStart);
    },
}
</script>
<template>
    <div class="slider">
        <div v-text="value" />
    </div>
</template>
<style scoped>
.slider {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
    background-color: #77ecec88;
}

.slider div {
    cursor: pointer;
    width: 100%;
    text-align: center;
}
</style>