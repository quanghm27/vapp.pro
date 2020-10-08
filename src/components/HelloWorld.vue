<template>
  <div class="main container-fluid">
      <div class="text-center" v-if="sharedKeyInvalid">
        <h1>Mã chia sẻ không chính xác!</h1>
      </div>
      <div class="card card-default" v-else>
        <div class="card-header">
            <div style="width: 70%" class="card-title">
                Bảng theo dõi nhiệt độ
            </div>
            <div style="width: 30%; float: left">
                <input style="outline: none" type="text" class="" v-model="newSharekey" @input="newShareKeyInvalid = false"/>
                <button @click="addShareKey()">Thêm mã</button>
                <span style="display:block; color: red;" v-show="newShareKeyInvalid"> {{ newShereKeyInvalidMsg }}</span>
            </div>
        </div>
        <div class="card-body">
          <div class="container">
            <div class="row">
              <PatientInfo v-for="patientInfo in patientInfos" :patient="patientInfo" :patientCount="patientInfos.length" :key="patientInfo.id" v-on:delete="onDeletePatient"/>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import PatientInfo from "./PatientInfo.vue"
  import _ from 'lodash'

  const API_VALIDATE_SHAREKEY =  'http://bc-api.gl-sci.com/api/Common/GetShareKey/'
  const API_GET_DATA_SHAREKEYS = 'http://bc-api.gl-sci.com/api/Common/GetDataByShareKey/'
  export default {
    name: 'HelloWorld',
    components: {PatientInfo},
    props: {
    },
    data() {
      return {
        sharedKeyInvalid: true,
        newSharekey: '',
        newShareKeyInvalid: false,
        newShereKeyInvalidMsg: 'Mã chia sẻ không chính xác',
        patientInfos: []
      }
    },
    created() {
      let sharekey = this.getShareKeyFromUrl()
      this.getShareKey(sharekey)
    },
    methods: {
      pushShareKeyToStorage(item) {
          let shareKeys = JSON.parse(sessionStorage.getItem('shareKeys')) || [];
          shareKeys.push(item);
          sessionStorage.setItem('shareKeys', JSON.stringify(shareKeys));
      },
      getShareKeyFromUrl() {
          let fullpath = window.location.href
          let url = new URL(fullpath)
          let shareKey = url.pathname.substring(1)
          return shareKey
      },
      async getShareKey(shareKey) {
          let data  = await fetch(API_GET_DATA_SHAREKEYS + shareKey).then(r => r.json())
          if (data.status) {
              this.pushShareKeyToStorage(shareKey)
              this.sharedKeyInvalid = false
              let info = data.data
              info.shareKey = shareKey
              this.patientInfos.push(info)
          }
      },
      async addShareKey() {
          let sharekey = this.newSharekey
          let data = await fetch(API_VALIDATE_SHAREKEY + sharekey).then(r => r.json())
          if (data.status) {
            this.getShareKey(sharekey)
          } else {
              this.newShareKeyInvalid = true
          }

      },
        onDeletePatient(shareKey) {
          let index = _.findIndex(this.patientInfos, function (item) {
              return item.shareKey === shareKey
          })
          this.$delete(this.patientInfos, index)
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .container-fluid {
    /*background-color: #f4f6f9;*/
    /*width: 100%;*/
    /*padding-right: 7.5px;*/
    /*padding-left: 7.5px;*/
    margin-right: 20px;
    margin-left: 20px;
  }
  .container {
      /*background-color: #f4f6f9;*/
      /*width: 100%;*/
      /*padding-right: 7.5px;*/
      /*padding-left: 7.5px;*/
      margin-right: 10px;
      margin-left: 10px;
  }
  .text-center {
    text-align: center;
  }
  .row {
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -7.5px;
    margin-left: -7.5px;
  }
  .card {
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2);
    margin-bottom: 1rem;
  }
  .card {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #ffffff;
    background-clip: border-box;
    border: 0 solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
  }
  .card-header:first-child {
    border-radius: calc(0.25rem - 0) calc(0.25rem - 0) 0 0;
  }
  .card-header {
    background-color: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    padding: 0.75rem 1.25rem;
    position: relative;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
  .card-title {
    float: left;
    font-size: 1.1rem;
    font-weight: 400;
    margin: 0;
  }
  h5 {
    font-size: 1.25rem;
  }
  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1.25rem;
  }
</style>
