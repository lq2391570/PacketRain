// pages/redBacketRain/redBacketRain.js
import cax from '../../component/cax/index.js'
const info = wx.getSystemInfoSync()
const innerAudioContext = wx.createInnerAudioContext()
//获取应用实例
const app = getApp()
var shapeArray = []
var shape2Array = []
//钻石Array
var diamondsArray = []
//boomArray
var boomArray = []
var speed = 1.5
var createSpeed = 2400
var createSpeed2 = 2800
var createSpeed3 = 3400
//时间戳
var timestamp = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    numOfLife: 5,
    numOfTime: 99,
    lifeImageArray: ["../../assets/life0.png", "../../assets/life1.png", "../../assets/life2.png", "../../assets/life3.png", "../../assets/life4.png", "../../assets/life5.png"],
    animationData: {},
    changeScore: 0,
    isGameOver: false,
    interval1: "",
    interval2: "",
    interval3: "",
    interval4: "",
    interval5: "",
    numOfContinuation: 0
  },
  reflashSpeed() {
    speed = 1.5
    createSpeed = 2400
    createSpeed2 = 2800
    createSpeed3 = 3400
  },
  //分数改变
  changeOfScore(myScore) {
    this.setData({
      score: myScore
    })
  },
  //游戏结束
  gameOverBtnClick() {
    wx.showToast({
      title: '游戏结束',
    })
  },
  //分数动画
  animationOfScore() {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.opacity(1).step()
    setTimeout(function () {
      animation.opacity(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 10)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateScore()
  },
  //开启一个倒计时关闭游戏
  stopGame(bgStage) {
    var that = this
    this.data.interval5 = setInterval(function () {
      var nowTime = that.data.numOfTime - 1
      //5s上传一次分数
      if (nowTime % 5 == 0) {
        that.updateScore()
      }
      //20S增加一次速度
      if (nowTime % 20 == 0) {
        that.speedChange(bgStage)
      }
      that.setData({
        numOfTime: nowTime
      })
    }, 1000)
    setTimeout(function () {
      that.gameOver(bgStage)
      that.updateScore()
    }, 1000 * that.data.numOfTime)
  },
  //关闭游戏（gameover）
  gameOver(bgStage) {
    this.reflashSpeed()
    clearInterval(this.data.interval1)
    clearInterval(this.data.interval2)
    clearInterval(this.data.interval3)
    clearInterval(this.data.interval4)
    clearInterval(this.data.interval5)
    shapeArray.forEach(function (value, i) {
      value.destroy()
      bgStage.update()
    })
    shape2Array.forEach(function (value, i) {
      value.destroy()
      bgStage.update()
    })
    diamondsArray.forEach(function (value, i) {
      value.destroy()
      bgStage.update()
    })
    boomArray.forEach(function (value, i) {
      value.destroy()
      bgStage.update()
    })
    this.setData({
      isGameOver: true
    })
  },
  //开启定时器创建shape1
  startInterval1(bgStage) {
    var that = this
    var indexNum = 1
    this.data.interval1 = setInterval(function () {
      indexNum++
      let redCardName = "redCard" + String(indexNum)
      that.createShape(bgStage, redCardName)
    }, createSpeed)
  },
  //开启定时器创建shape2
  startInterval2(bgStage) {
    var that = this
    var indexNum2 = 1
    this.data.interval2 = setInterval(function () {
      indexNum2++
      let redCardName2 = "redCard2" + String(indexNum2)
      that.createShape2(bgStage, redCardName2)
    }, createSpeed2)
  },
  //开启定时器创建炸弹和钻石
  startBoomAndDiamond(bgStage) {
    var that = this
    var indexNum3 = 1
    this.data.interval4 = setInterval(function () {
      indexNum3++
      let diamondsName = "diamonds" + String(indexNum3)
      that.createDiamonds(bgStage, diamondsName)
      let boomsName = "booms" + String(indexNum3)
      that.createBooms(bgStage, boomsName)
    }, createSpeed3)
  },
  //开启定时器移动红包雨
  startInterval3(bgStage) {
    let that = this
    this.data.interval3 = setInterval(function () {
      shapeArray.forEach(function (value, i) {
        value.y = value.y + speed
        if (value.y > info.windowHeight) {
          bgStage.remove(value)
          shapeArray.splice(i, 1)
          that.setData({
            numOfContinuation: 0
          })
        }
      })
      shape2Array.forEach(function (value, i) {
        value.y = value.y + speed
        if (value.y > info.windowHeight) {
          bgStage.remove(value)
          shape2Array.splice(i, 1)
          that.setData({
            numOfContinuation: 0
          })
        }
      })
      diamondsArray.forEach(function (value, i) {
        value.y = value.y + speed
        if (value.y > info.windowHeight) {
          bgStage.remove(value)
          diamondsArray.splice(i, 1)
          that.setData({
            numOfContinuation: 0
          })
        }
      })
      boomArray.forEach(function (value, i) {
        value.y = value.y + speed
        if (value.y > info.windowHeight) {
          bgStage.remove(value)
          boomArray.splice(i, 1)
        }
      })
      bgStage.update()
    }, 16)
  },
  //创建shape
  createShape(newStage, newName) {
    //创建随机位置
    var that = this
    var ranNum = Math.random() * (info.windowWidth - 50)
    newName = new cax.Bitmap('../../assets/redBacket.png')
    newName.scaleX = newName.scaleY = 0.55
    newName.x = ranNum
    newName.y = - 50
    newName.on("touchstart", () => {
      Array.prototype.indexValue = function (arr) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == arr) {
            return i;
          }
        }
      }
      let shapeIndex = shapeArray.indexValue(newName)
      shapeArray.splice(shapeIndex, 1)
      newName.destroy()
      that.animationOfScore()
      innerAudioContext.play()

      var numContinuation = that.data.numOfContinuation + 1
      var nowScore = that.data.score + 1 + numContinuation
      var changeOfScore = numContinuation + 1
      that.setData({
        score: nowScore,
        changeScore: changeOfScore,
        numOfContinuation: numContinuation
      })
    })
    newStage.add(newName)
    //将shape都放入数组中
    shapeArray.push(newName)
  },
  //创建+2Shape
  createShape2(newStage, newName) {
    //创建随机位置
    var that = this
    var ranNum = Math.random() * (info.windowWidth - 50)
    newName = new cax.Bitmap('../../assets/bigRedbacket.png')
    newName.scaleX = newName.scaleY = 0.75
    newName.x = ranNum
    newName.y = - (Math.random() * 300 + 50)
    newName.on("touchstart", () => {
      Array.prototype.indexValue = function (arr) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == arr) {
            return i;
          }
        }
      }
      let shapeIndex = shape2Array.indexValue(newName)
      shape2Array.splice(shapeIndex, 1)
      newName.destroy()
      that.animationOfScore()
      innerAudioContext.play()
      var numContinuation = that.data.numOfContinuation + 1
      var nowScore = that.data.score + 2 + numContinuation
      var changeOfScore = numContinuation + 2
      that.setData({
        score: nowScore,
        changeScore: changeOfScore,
        numOfContinuation: numContinuation
      })
    })
    newStage.add(newName)
    //将shape都放入数组中
    shape2Array.push(newName)
  },
  //创建diamonds
  createDiamonds(newStage, newName) {
    //创建随机位置
    //钻石
    var that = this
    var ranNum = Math.random() * (info.windowWidth - 50)
    newName = new cax.Bitmap('../../assets/diamonds.png')
    newName.scaleX = newName.scaleY = 0.7
    newName.x = ranNum
    newName.y = -(Math.random() * 200 + 50)
    newName.on("touchstart", () => {
      Array.prototype.indexValue = function (arr) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == arr) {
            return i;
          }
        }
      }
      let shapeIndex = diamondsArray.indexValue(newName)
      diamondsArray.splice(shapeIndex, 1)
      newName.destroy()
      that.animationOfScore()
      innerAudioContext.play()
      var numContinuation = that.data.numOfContinuation + 1
      var nowScore = that.data.score + 5 + numContinuation
      var changeOfScore = numContinuation + 5
      that.setData({
        score: nowScore,
        changeScore: changeOfScore,
        numOfContinuation: numContinuation
      })
    })
    newStage.add(newName)
    //将shape都放入数组中
    diamondsArray.push(newName)
  },
  //创建Boom
  createBooms(newStage, newName) {
    var that = this
    var ranNum = Math.random() * (info.windowWidth - 50)
    newName = new cax.Bitmap('../../assets/boom.png')
    newName.scaleX = newName.scaleY = 0.45
    newName.x = ranNum
    newName.y = -(Math.random() * 100 + 50)
    newName.on('touchstart', () => {
      // console.log('rect tap')
      Array.prototype.indexValue = function (arr) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == arr) {
            return i;
          }
        }
      }
      let shapeIndex = boomArray.indexValue(newName)
      boomArray.splice(shapeIndex, 1)
      newName.destroy()
      that.animationOfScore()
      innerAudioContext.play()
      var nowScore = that.data.score - 5
      var nowLife = that.data.numOfLife - 1
      //判断生命是否结束
      if (nowLife == 0) {
        that.setData({
          score: nowScore,
          numOfLife: nowLife,
          changeScore: -5,
          numOfContinuation: 0
        })
        that.gameOver(newStage)
      } else {
        that.setData({
          score: nowScore,
          numOfLife: nowLife,
          changeScore: -5,
          numOfContinuation: 0
        })
      }
    })
    newStage.add(newName)
    //将shape都放入数组中
    boomArray.push(newName)
  },
  //速度变量
  speedChange(newStage) {
    speed = speed + 1.1
    clearInterval(this.data.interval4)
    clearInterval(this.data.interval1)
    clearInterval(this.data.interval2)
    createSpeed = createSpeed - 350
    createSpeed2 = createSpeed2 - 350
    createSpeed3 = createSpeed3 - 350
    this.startInterval1(newStage)
    this.startInterval2(newStage)
    this.startBoomAndDiamond(newStage)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.reflashSpeed()
    timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    console.log("当前时间戳为：" + timestamp)
    var that = this
    const bgStage = new cax.Stage(info.windowWidth, info.windowHeight, 'myCanvas', this)
    // 开启定时器创建shape1(+1红包)
    this.startInterval1(bgStage)
    // // 开启定时器创建shape2(+2红包)
    this.startInterval2(bgStage)
    //开启定时器创建diamonds
    this.startBoomAndDiamond(bgStage)
    // //开启定时器移动红包雨
    this.startInterval3(bgStage)
    //倒计时关闭
    this.stopGame(bgStage)
    this.audioOfClick()
  },
  //点击音效
  audioOfClick() {
    innerAudioContext.autoplay = false
    innerAudioContext.src = 'http://videoss.cdn.bcebos.com/dianji.mp3'
    innerAudioContext.onPlay(() => {
      
    })
    innerAudioContext.onError((res) => {
     
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.interval1)
    clearInterval(this.data.interval2)
    clearInterval(this.data.interval3)
    clearInterval(this.data.interval4)
    clearInterval(this.data.interval5)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})