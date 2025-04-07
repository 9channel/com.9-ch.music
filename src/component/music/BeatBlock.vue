<script lang="ts">
export default {
    props: {
        index: {
            type: Number,
            default: 0
        },
        initValue: {
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            value: this.initValue,
        };
    },
    methods: {
        handleClick() {
            this.value = this.value + 1;
            if (this.value > 3) {
                this.value = 0;
            }
            this.$emit('change', this.index, this.value);
        },
    },
}
</script>
<template>
    <div class="beatblock">
        <div @click="handleClick">
            <div class="subblock">
                <div v-for="i in value" :key="i" :style="{ backgroundColor: `rgba(21, 255, 21, ${0.2 * i})` }"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.beatblock div {
    width: 100%;
    height: 100px;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px solid #000000;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    /* 下对齐 */
    display: flex;
    align-items: end
}

.subblock {
    display: flex;
    flex-direction: column-reverse;
    justify-content: end;
    align-items: center;
}

.subblock div {
    height: 33.33%;
    width: 100%;
}
</style>