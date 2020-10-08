<template>
    <div v-bind:class="{'col-md-4': hideHistory, 'col-md-12' : !hideHistory}">
        <div class="card">
            <div class="card-header" v-bind:class="cardHeaderClass" style="position: relative;">
                <div class="col-md-8 col-sm-2 card-header-info">
                    Mã chia sẻ: {{ patient.shareKey }}
                </div>
                <div style="
                    position: absolute;
                    right: 3%;
                    top: 20%;
                    color: azure;
                    cursor: pointer;
                " v-if="patientCount > 1">
                    <i class="far fa-2x fa-window-close" v-on:click="remove(patient.shareKey)"></i>
                </div>
            </div>
            <div class="card-body position-relative" v-bind:class="cardBodyClass">
                <div class="batery-info text-white position-absolute">
                    <i class="fa" v-bind:class="batteryInfo"></i>
                    {{ patient.batteryValue | percent}}</div>
                <div class="patient-avatar position-absolute">
                    <img class="patient-image rounded-circle" style="border: 2px solid white" :src="patient.imageUrl" alt="avatar">
                    <div v-bind:class="connectStatus"></div>
                </div>

                <div class="last-update text-white position-absolute"> {{ lastseen}}</div>
                <div class="patient-name text-white position-absolute"> {{ patient.userFullName}}</div>
                <div class="patient-birth text-white position-absolute">
                    <i class="fa fa-birthday-cake"></i>
                    {{ birthDay }}
                </div>
                <div class="patient-temperature text-white position-absolute"> {{ patient.dataValue | celsius}}</div>
                <div class="temperature-range text-white position-absolute"> {{ patient.minTemp | celsius}} ~ {{ patient.maxTemp | celsius}} </div>
            </div>
            <div class="card-body card-graph" v-show="!hideHistory">
                <component :is="'PatientHistory'"
                           v-bind:shareKey="patient.shareKey"
                           v-bind:minTemp="patient.minTemp"
                           v-bind:maxTemp="patient.maxTemp"
                           v-if="isShownHistory"></component>
            </div>
            <div class="card-footer text-center"  v-bind:class="cardFooterClass">
                <p class="text-white see-more" @click="goToHistory()">
                    {{ hideHistory ? 'Xem Lịch Sử' : 'Ẩn Lịch Sử'}}
                    <i class="fa" v-bind:class="hideHistory ? 'fa-arrow-circle-down' : 'fa-arrow-circle-up'"></i>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    import PatientHistory from './PatientHistory.vue'
    moment.locale('vi')
    export default {
        name: 'PatientInfo',
        props: ['patient', 'patientCount'],
        components: {PatientHistory},
        data() {
            return {
                hideHistory: true,
                isShownHistory: false,
                cardHeaderClass: '',
                cardBodyClass: '',
                cardFooterClass: ''
            }
        },
        created() {
            this.setCardClass()
        },
        computed: {
            tempState() {
                let tempState = ''

                if (this.patient.dataValue <= 37.4) {
                    tempState = 'temp-safe'
                } else if ( 37.5 <= this.patient.dataValue &&  this.patient.dataValue <= 38.4) {
                    tempState = 'temp-warn'
                } else {
                    tempState = 'temp-danger'
                }
                return tempState
            },
            birthDay() {
                return moment(this.patient.dateOfBirth).format('DD/MM/YYYY')
            },
            batteryInfo() {
                let info = 'fa-battery-'
                let batteryValue = this.patient.batteryValue
                if (batteryValue == 0) {
                    info += 'empty'
                } else if (0 < batteryValue && batteryValue < 25) {
                    info += 'quarter'
                } else if (25 < batteryValue && batteryValue < 75 ) {
                    info += 'half'
                } else if (75 < batteryValue && batteryValue < 100) {
                    info += 'three-quarters'
                } else {
                    info += 'full'
                }
                return info
            },
            lastseen() {
                return moment(this.patient.serverTime).fromNow()
            },
            imageAvatar() {
                return this.patient.imageUrl || '/images/default-avatar.png'
            },
            connectStatus() {
                return this.patient.isConnecting ? 'status-connect' : ''
            }
        },
        methods: {
            goToHistory(){
                if (!this.isShownHistory) {
                    this.isShownHistory = true
                }
                this.hideHistory = !this.hideHistory
            },
            setCardClass() {
                if (this.patient.dataValue <= 37.4) {
                    this.cardHeaderClass = 'header-safe'
                    this.cardBodyClass = 'body-safe'
                    this.cardFooterClass = 'footer-safe'
                } else if ( 37.5 <= this.patient.dataValue &&  this.patient.dataValue <= 38.4) {
                    this.cardHeaderClass = 'header-warn'
                    this.cardBodyClass = 'body-warn'
                    this.cardFooterClass = 'footer-warn'
                } else {
                    this.cardHeaderClass = 'header-danger'
                    this.cardBodyClass = 'body-danger'
                    this.cardFooterClass = 'footer-danger'
                }
            },
            remove(shareKey) {
                this.$emit("delete", shareKey);
            }
        },
        filters: {
            celsius: function (value) {
                return value + '°C';
            },
            percent: function (value) {
                return value + '%';
            }
        },
        mounted() {
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @media (min-width: 768px){
        .col-md-4 {
            -ms-flex: 0 0 33.333333%;
            flex: 0 0 33.333333%;
            max-width: 33.333333%;
        }
        .col-md-8 {
            -ms-flex: 0 0 66.6666667%;
            flex: 0 0 66.6666667%;
            max-width: 66.6666667%;
        }
    }
    .col-md-4 {
        position: relative;
        width: 100%;
        padding-right: 7.5px;
        padding-left: 7.5px;
    }
    .col-md-12 {
        position: relative;
        width: 100%;
        padding-right: 7.5px;
        padding-left: 7.5px;
    }
    .round-image {
        border-radius: 50%;
        border: 2px solid white;
    }
    .card-header-info {
        font-weight: 700;
        /*font-size: 1.2em;*/
        color: #fff;
    }
    .header-safe {
        background-image: linear-gradient(45deg, #5594d4, #536eb4);
    }
    .body-safe {
        background-image: linear-gradient(45deg, #85bee8, #829cd1);
    }
    .footer-safe {
        background-image: linear-gradient(45deg, #559fdb, #5378bd);
    }
    .header-warn {
        background-image: linear-gradient(45deg, #f88607, #f26908);
    }
    .body-warn {
        background-image: linear-gradient(45deg, #fdb41b, #f79621);
    }
    .footer-warn {
        background-image: linear-gradient(45deg, #eb941c, #f26a08);
    }
    .header-danger {
        background-image: linear-gradient(45deg, #b24e2f, #af302a);
    }
    .body-danger {
        background-image: linear-gradient(45deg, #bf7044, #bd433c);
    }
    .footer-danger {
        background-image: linear-gradient(45deg, #b36031, #af302a);
    }
    .rounded-circle {
        border-radius: 50% !important;
    }
    .position-relative {
        position: relative;
    }
    .position-absolute {
        position: absolute;
    }
    .text-white {
        color: #ffffff !important;
    }
    .patient-image {
        height: 80px;
    }
    .last-update {
        left: 5%;
        top: 50%;
        font-size: 14px;
    }
    .batery-info {
        font-size: 0.9em;
        top: 5%;
    }
    .patient-avatar, .patient-temperature {
        top: 2em;
    }
    .patient-name {
        top: 15%;
        left: 120px;
        font-size: 30px;
        font-weight: 200;
    }
    .patient-birth, .patient-note {
        left: 125px;
    }
    .patient-birth {
        top: 35%;
        font-size: 14px;
    }
    .temperature-range {
        top: 170px;
        right: 5%;
        font-size: 14px;
    }
    .patient-temperature {
        top: 120px;
        right: 5%;
        font-size: 40px;
        font-weight: 500;
    }
    .card-body {
        min-height: 200px;
    }
    .status-connect {
        background: #42B72A;
        height: 20px;
        width: 20px;
        border-radius: 50%!important;
        bottom: 5px;
        left: 10px;
        position: absolute;
        border: 2px solid white;
    }
    @media (max-width: 1366px) {
        .card-header-info {
            font-size: 13px;
            text-align: left !important;
        }
        .patient-image {
            height: 80px;
        }
        .batery-info {
            font-size: 12px;
        }
        .last-update {
            left: 27px;
            top:55%;
            font-size: 12px;
        }
        .patient-name {
            top: 15%;
            left: 110px;
            font-size: 16px;
            font-weight: 400;
        }
        .patient-birth {
            left: 110px;
            top: 28%;
            font-size:12px;
        }
        .patient-note {
            left: 110px;
            top: 38%;
            font-size:12px;
        }
    }
</style>
