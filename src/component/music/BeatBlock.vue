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
    <div class="beatblock" @click="handleClick">
        <div class="subblock">
            <div v-for="i in value" :key="i" :style="{ backgroundColor: `rgba(21, 255, 21, ${0.2 * i})` }"></div>
        </div>
    </div>
</template>
<style scoped>
.beatblock div {
    width: 100%;
    height: 120px;
    background-color: #ffffff;
    border: 1px solid #cdcdcd;
    cursor: pointer;
    border-radius: 0.25rem;
}

.beatblock:hover {
    border-color: #0085f2;
    box-shadow: 0 0 5px rgba(0, 144, 237, 0.4);
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
    border: 1px solid #cdcdcd;
    border-radius: 0.25rem;
}
</style>