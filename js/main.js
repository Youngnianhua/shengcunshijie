//《超苦逼冒险者》
//使用框架：React，jQuery
//作者：maou
//联系方式：496863906@qq.com


'use strict';
// var move=function(e){
//     e.preventDefault && e.preventDefault();
//     e.returnValue = false;
//     e.stopPropagation && e.stopPropagation();
//     return false;
// }
// var start=function(e){
//     pos.y = e.targetTouches[0].pageY;
//             pos.x = e.targetTouches[0].pageX;
//     }
//     var end=function(e){
//     //stop the zoom in event be motivated ,for the handle equipment's dobule click event.
//     move(e);
//     y = e.targetTouches[0].pageY;
//     x = e.targetTouches[0].pageX;
//     if(Math.abs(pos.y-y)<3 ||Math.abs(pos.x-x)<3){
//         setTimeout(function(){fireEvent(e.target,'click');},2);
//     }
//     pos=null;
//     return false;
// }
// document.documentElement.style.overflow='hidden'; //低版本需要
// document.body.style.overflow='hidden';//mobile 低版本不生效
// eventUtil.addEvent(window,'touchmove',move);
// eventUtil.addEvent(document.body,'touchstart',start);
// eventUtil.addEvent(document.body,'touchend',end);

var CTRL_PRESSED = false;
var SHIFT_PRESSED = false;
 $(function(){
      $(document).keypress(function (e) {
        if (e.keyCode == 32){
          //...........code.......
            event.preventDefault();
            return false;
        }
        if (e.keyCode == 13){
          //...........code.......
            event.preventDefault();
            return false;
        }
     })
      $(document).keyup(function (e) {
        if (e.keyCode == 32){
            event.preventDefault();
            return false;
          //...........code.......
        }
        if (e.keyCode == 13){
          //...........code.......
            event.preventDefault();
            return false;
        }
     })
 });

//引入React动画库
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


function IsPC(){
   var userAgentInfo = navigator.userAgent;
   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
   var flag = true;
   for (var v = 0; v < Agents.length; v++) {
       if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
   }
   return flag;
}
var IS_IPAD = (IsPC())?false:true;
// IS_IPAD = true;


$(function() {
    FastClick.attach(document.body);
});

// function getEnveronmentTemperature(day){
//     var seasonMap = {
//         'spring':0,
//         'summer':1,
//         'autumn':2,
//         'winter':3,
//     };
//     var base = seasonMap['spring']* SEASON_CIRCLE - SEASON_CIRCLE/2 ;
//     var temperature = (Math.sin(Math.PI*(day+base)/(2*SEASON_CIRCLE)));
//     temperature = 50 * (temperature > 0?1:-1) * Math.pow(temperature,4);
//     return temperature;
// }
// for(var i = 0;i<100;i++){
//     console.log('day' + i + ' ' +getEnveronmentTemperature(i));
// }

// var LocString = String(window.document.location.href);
// function getQueryStr(str) {
//     var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
//     if (tmp = rs) {
//         return tmp[2];
//     }
//     // parameter cannot be found
//     return "";
// }


function toParagraphs(arr){
    if(typeof arr == 'string')return arr;
    var result = [];
    for(var i = 0; i < arr.length; i++){
        result.push(<p key = {i}>{arr[i]}</p>);
    }
    return result;
}

//游戏逻辑层/////////////////////////////////////////////////////////////////////////////
//tiny components
//小组件
var ItemComponent = React.createClass({
    //物体组件
    getDefaultProps:function(){
        return{
            item:null,
            amount:0,
            box:null,
            handleClick:null,
        }
    },
    contextTypes:{
        useItem             :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        changeMsg           :React.PropTypes.func.isRequired,
        handleExchange      :React.PropTypes.func.isRequired,
        playerStateChange   :React.PropTypes.func.isRequired,
        isDueling           :React.PropTypes.bool.isRequired,
        AudioEngine         :React.PropTypes.object.isRequired,
        durableSaveData     :React.PropTypes.object.isRequired,
        getMaxDurable       :React.PropTypes.func.isRequired,
        currentEquip        :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        skill               :React.PropTypes.object.isRequired,
        dungeonSaveData     :React.PropTypes.object.isRequired,
        mstState            :React.PropTypes.object.isRequired,
        showMsg             :React.PropTypes.func.isRequired,
        handleItemClick     :React.PropTypes.func.isRequired,
    },
    itemMouseEnter:function(){
        this.context.changeMsg(this.props.item,'item');
    },
    itemMouseClick:function(event){
        // this.context.AudioEngine.playEffect('pick');

        CTRL_PRESSED = event.ctrlKey;
        SHIFT_PRESSED = event.shiftKey;

        if(this.props.handleClick){
            this.props.handleClick();
        }
        if(IS_IPAD){
            this.itemMouseEnter();
        }

        this.context.handleExchange(this.props.item,this.props.box,this.context.isDueling);
    },
    itemClickRight:function(event){
        var item = this.props.item;
        var box = this.props.box;
        event.preventDefault();
        //装备切换
        if(box != 'bag' && ITEM_DATA[item].equipType){
            this.itemMouseClick(event);
        }
        if(this.props.handleClick){
            this.props.handleClick();
        }

        this.context.handleItemClick(item,box);

    },
    checkIfISCurrentEquip:function(){
        var item = this.props.item;
        var equipType = ITEM_DATA[item].equipType;
        if(!equipType)return false;
        var currentEquip = clone(this.context.currentEquip);
        return (currentEquip[equipType] == item);
    },
    render:function(){
        var item = this.props.item;
        var isCurrentEquip = this.checkIfISCurrentEquip(item);
        var maxDurable = this.context.getMaxDurable(item);
        return      <div className = {"item " + (isCurrentEquip?'currentEquip':'')} onMouseEnter = {this.itemMouseEnter} onClick = {this.itemMouseClick} onContextMenu = {this.itemClickRight}>
                        <p style = {{color:(TYPE_DATA[ITEM_DATA[this.props.item].type].color||COLOR.BLACK)}}>{ITEM_DATA[item].name}</p>
                        {ITEM_DATA[item].durable?<ProgressComponent  addStyle = {{position: 'absolute',width: '30px',left: '9px',top: '22px',height: '5px'}} max = {maxDurable} current = {maxDurable - this.context.durableSaveData[item]} />:null}
                        <span className = "badge itemAmount">{this.props.amount}</span>
                    </div>
    }
});
var StateVectorComponent = React.createClass({
    contextTypes:{
        playerState:React.PropTypes.object.isRequired,
        changeMsg:React.PropTypes.func.isRequired,
        getTempDesc:React.PropTypes.func.isRequired,
        getMaxState:React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return {
            state:null
        }
    },
    showMsg:function(){
        this.context.changeMsg(this.props.state,'state');
    },
    render:function(){
        var playerState = this.context.playerState;
        var state = playerState[this.props.state];
        var stateName = STATE_DATA[this.props.state].name;
        var max = this.context.getMaxState(this.props.state);
        function getColor(num){
            var str = "";
            var color_0,color_1,r,g,b;
            if(this.props.state == 'temp'){
                color_1 = {r:100,g:177,b:255};
                color_0 = {r:255,g:177,b:100};
                var offset = num + 50;
                offset = offset<0?0:offset;
                offset = offset>100?100:offset;
                r = Math.floor((Math.abs(offset))*(color_0.r - color_1.r)/max + color_1.r);
                g = Math.floor((Math.abs(offset))*(color_0.g - color_1.g)/max + color_1.g);
                b = Math.floor((Math.abs(offset))*(color_0.b - color_1.b)/max + color_1.b);
            }else{
                color_0 = {r:162,g:184,b:168};
                color_1 = {r:43,g:14,b:11};
                r = Math.floor((Math.abs(num))*(color_0.r - color_1.r)/max + color_1.r);
                g = Math.floor((Math.abs(num))*(color_0.g - color_1.g)/max + color_1.g);
                b = Math.floor((Math.abs(num))*(color_0.b - color_1.b)/max + color_1.b);
            }
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        return  <div className = "stateVector" onMouseEnter = {this.showMsg} style = {{background:getColor.bind(this,Math.ceil(state.amount))()}} >
                    {stateName}
                    <span className = "badge"> {this.props.state == 'temp'?TEMP_DATA[this.context.getTempDesc()].name:Math.ceil(state.amount)} </span>
                </div>
    }
});
var VectorComponent = React.createClass({
    getDefaultProps:function(){
        return{
            msg_top:null,
            msg_top_color:COLOR.BLACK,
            msg_bottom:null,
            msg_bottom_color:COLOR.BLACK,
            btn_bottom:null,
            onContextMenu:null,
        }
    },
    render:function(){
        function getBottom(){
            if(this.props.btn_bottom){
                return <div>{this.props.btn_bottom}</div>
            }else{
                return <div style = {{color:this.props.msg_bottom_color}}>{this.props.msg_bottom}</div>
            }
        }
        return  <div className = 'vector' onContextMenu = {this.props.onContextMenu}>
                    <div className = "item">
                        <div style = {{color:this.props.msg_top_color}}>{this.props.msg_top}</div>
                        {getBottom.bind(this)()}
                    </div>
                </div>
    }
});
var RequireComponent = React.createClass({
    getDefaultProps:function(){
        return{
            requireList:null,
            checkHaveResource:null,
            isGreen:false,
            showTotal:false,
            withSpace:false,
            separator:null,
            haveBox:false,
        }
    },
    contextTypes:{
         checkHaveResource: React.PropTypes.func.isRequired,
         boxSaveData      : React.PropTypes.object.isRequired
    },
    render:function(){
        var requireList = this.props.requireList;
        var boxSaveData = this.context.boxSaveData;
        if(this.props.haveBox){
            var bag = together(boxSaveData.bag.things,boxSaveData.bigBox.things);
        }else{
            var bag = clone(this.context.boxSaveData.bag.things);
        };
        function mapRes(){
            var result = [];
            var count = 0;
            var total = getLength(requireList);

            for (var attr in requireList) {
                // if(count > 0 && count%2 == 0)result.push(<br key = {'br_'+count}/>);
                if(count > 0&&this.props.withSpace)result.push(<br key = {'br_' + count}/>);
                var amount = requireList[attr];
                var name = ITEM_DATA[attr]?ITEM_DATA[attr].name:STATE_DATA[attr].name;
                result.push(<span key = {count} className = "resourceName" style = {{color:this.props.isGreen?COLOR.GREEN:(this.context.checkHaveResource(attr,amount,bag)?COLOR.GREEN:COLOR.RED)}}>
                                {name}
                                <span className = "badge resourceAmount">
                                    {this.props.showTotal?(amount+'/'+(bag[attr]||0)):amount}
                                </span>
                                {total == count + 1 ? null:this.props.separator}
                            </span>);
                count ++;
            };
            return result;
        }
        return  <span>
                    {mapRes.bind(this)()}
                </span>
    }
});
var ProgressComponent = React.createClass({
    getDefaultProps:function(){
        return{
            max:null,
            current:null,
            addStyle:{},
            addClass:'',
            addClassIn:0,
        }
    },
    render:function(){
        return  <div style = {this.props.addStyle} className = {"progress " + this.props.addClass}>
                    <div className = {"progress-bar progress-bar-striped active " + this.props.addClassIn} role="progressbar" aria-valuenow = {this.props.current} aria-valuemin="0" aria-valuemax = {this.props.max} style = {{width:(Math.ceil(100*this.props.current/this.props.max)) + '%'}}>
                    </div>
                </div>
    }
});
var BoxComponent = React.createClass({
    contextTypes:{
        boxSaveData:React.PropTypes.object.isRequired,
        setCurrentBox:React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return {
            box:'',
            isRegister:false,
            handleClick:null
        };
    },
    getInitialState:function(){
        return {
            items:null,
            size:null
        }
    },
    componentWillMount:function(){
        var box = this.context.boxSaveData[this.props.box];
        if(this.props.box != 'bag' && !box.isDone){
            this.context.setCurrentBox(this.props.box);
        }
    },
    componentWillUnmount:function(){
        var box = this.context.boxSaveData[this.props.box];
        if(this.props.box != 'bag' && !box.isDone)this.context.setCurrentBox('');
    },
    render:function() {
        var box = this.context.boxSaveData[this.props.box];
        var bagSize = this.state.size;
        function createVector(){
            var result = [];
            var count = 0;
            var itemList = box.things;
            var bagSize = this.props.isRegister?getLength(box.things)+1:box.size;
            for (var attr in itemList) {
                result.push(
                        <li className = "vector" key = {count}>
                            <ItemComponent handleClick = {this.props.handleClick} item = {attr} box = {this.props.box}  amount = {itemList[attr]} key = {attr}/>
                        </li>
                    )
                count ++;
            };
            for (var i = count; i < bagSize; i++) {
                result.push(<li className = "vector" key = {count}></li>);
                count ++;
            };
            return result;
        };
        return  <ul className = "boxList">
                    {createVector.bind(this)()}
                </ul>
    }
});
var BtnBack = React.createClass({
    contextTypes:{
        callWindow: React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return{
            callBack:null,
            disabled:false,
        }
    },
    render:function(){
        function callBack(){
            this.context.callWindow(null);
            if(this.props.callBack){
                this.props.callBack();
            }
        }
        return <BtnComponent disabled = {this.props.disabled} handleClick = {callBack.bind(this)} desc = '返回'/>
    }
});
var BtnHome = React.createClass({
    getDefaultProps:function(){
        return{
            placeName:null,
            callBack:null,
        }
    },
    contextTypes:{
        setCurrentScene:React.PropTypes.func.isRequired,
        useTime        :React.PropTypes.func.isRequired,
        AudioEngine    :React.PropTypes.object.isRequired,
        getTimeNeed    :React.PropTypes.func.isRequired,
    },
    homeCallBack:function(){
        this.context.AudioEngine.stopBg(this.props.place);
        this.context.AudioEngine.playEffect('door_closed');
    },
    gohome:function(){
        if(this.props.placeName){
            var timeNeed = this.context.getTimeNeed(this.props.placeName);
            function callBack(){
                this.context.setCurrentScene('home');
                if(this.props.callBack != null){
                    this.props.callBack();
                }else{
                    this.homeCallBack()
                }
            }
            this.context.useTime(callBack.bind(this),timeNeed);
        }else{
                this.context.setCurrentScene('home');
        }
    },
    render:function(){
        return <BtnComponent desc = '回家' handleClick = {this.gohome}/>
    }
});
var ResourceDisplayComponent = React.createClass({
    getDefaultProps:function(){
        return {
            resource:null,
            type:'resource'
        }
    },
    getAmountDescAll:function(itemList){
        var type = this.props.type;
        //清算资源富集程度
        function getAmountDesc (amount){
            var arr = ['很少','较少','一般','较多','大量'];
            for (var i = 0; i < arr.length - 1; i++) {
                if(amount < i*10 + 10)
                return arr[i];
            };
            return arr[i];
        };
        var result = [];
        var res={};
        if(type == 'resource'){
            var attachData = ITEM_DATA;
            var isMst = false;
        }else{
            if((type == 'mst')){
                var attachData = MST_DATA;
                var isMst = true;
            }
        }
        for (var attr in itemList) {
            var typeName = attachData[attr].type || attr;
            var amount = isMst? itemList[attr].amount : itemList[attr];
            if(amount == 0)continue;
            if(res[typeName]){
                res[typeName] += amount;
            }else{
                res[typeName] = amount;
            }
        };
        for (var attr in res) {
            if(isMst?MST_DATA[attr]:TYPE_DATA[attr]){
                result.push(<p key = {attr}>
                                <span>{isMst? MST_DATA[attr].name:TYPE_DATA[attr].name}</span>
                                <span className="badge resourceAmount">
                                    {getAmountDesc(res[attr])}
                                </span>
                            </p>)
            }
        };
        return result;
    },
    render:function(){
        return  <div>
                    {this.getAmountDescAll(this.props.resource)}
                </div>
    }
})
var BtnComponent = React.createClass({
    contextTypes:{
        checkHaveResourceAll:React.PropTypes.func.isRequired,
        AudioEngine         :React.PropTypes.object.isRequired,
    },
    getDefaultProps:function(){
        return {
            disabled:false,
            handleClick:null,
            handleMouseEnter:null,
            desc:null,
            requireList:null,
            style:{},
            canEvent:false,
            sound:'pick',
            className:'btn',
        }
    },
    getDisabled:function(){
        return this.props.disabled||!this.context.checkHaveResourceAll(this.props.requireList,true)
    },
    handleClick:function(isRight){
        if(this.getDisabled())return;
        this.context.AudioEngine.playEffect(this.props.sound);

        if(this.props.handleRightClick && isRight){
            this.props.handleRightClick()
        }else{
            this.props.handleClick();
        }
    },
    handleMouseEnter:function(){
        if(this.getDisabled())return;
        if(this.props.handleMouseEnter)this.props.handleMouseEnter();
    },
    render:function(){
        return <button style = {this.props.style} onContextMenu = {this.handleClick.bind(null,'right')} onClick = {this.handleClick.bind(null,false)} onMouseEnter = {this.handleMouseEnter} className = {this.props.className + (this.getDisabled()?" disabled":'')}>{this.props.desc||this.props.children}</button>
    }
});

//调试用
var DebugComponent = React.createClass({
    contextTypes:{
        setStateFromChildren:React.PropTypes.func.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        playerState         :React.PropTypes.object.isRequired,
        handleDeath         :React.PropTypes.func.isRequired,
        dungeonSaveData     :React.PropTypes.object.isRequired,
        parentState         :React.PropTypes.object.isRequired,
    },
    handleAddItem:function(){
        var item = ($('#itemName')[0].value);
        var amount = parseInt($('#itemAmount')[0].value);
        for(var attr in ITEM_DATA){
            if (ITEM_DATA[attr].name == item){
                item = attr;
                var boxSaveData = this.context.boxSaveData;
                boxSaveData.bag.things[item] = amount;
                this.context.setStateFromChildren({boxSaveData:boxSaveData});
                break;
            }
        }

        for(var attr in STATE_DATA){
            if (STATE_DATA[attr].name == item){
                item = attr;
                var playerState = this.context.playerState;
                playerState[attr].amount = amount;
                this.context.setStateFromChildren({playerState:playerState});
                break;
            }
        }
    },
    changeStair:function(){
        var dungeonSaveData = this.context.dungeonSaveData;
        dungeonSaveData.stairCount = parseInt($('#stairNum')[0].value);
        this.context.setStateFromChildren({
            dungeonSaveData:dungeonSaveData
        })
    },
    log:function(){
        var state = this.context.parentState;
        var log = ($('#log')[0].value);
        eval(log);
    },
    logState:function(){
        var state = this.context.parentState;
    },
    render:function(){
        return (
                <div>
                    <input id = 'log'/>
                    <BtnComponent handleClick = {this.log} desc = '输出'/>
                    <BtnComponent handleClick = {this.logState} desc = '输出所有'/>
                    <input id = 'itemName'/>
                    <input id = 'itemAmount' type = 'number'/>
                    <BtnComponent handleClick = {this.handleAddItem} desc = '添加'/>
                    <BtnComponent handleClick = {this.context.handleDeath.bind(null,'hunger')} desc = '饿死'/>
                    <input id = 'stairNum' type = 'number'/>
                    <BtnComponent handleClick = {this.changeStair} desc = '穿越'/>
                </div>
            )
    }
});

//弹窗
var MenuBtnComponent = React.createClass({
    contextTypes:{
        showMenu            :React.PropTypes.string.isRequired,
        menuHint            :React.PropTypes.number.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
    },
    handleClick:function(){
        this.context.setStateFromChildren({showMenu:'menu'});
    },
    render:function(){
        var menuHint = this.context.menuHint;
        return <BtnComponent style = {{backgroundColor:'#9FAA83'}} className = 'stateVector' handleClick = {this.handleClick}><span>菜单</span>{(menuHint>0?<span className = 'badge'>{menuHint}</span>:'')}</BtnComponent>
    }
});
var CustomMenuComponent = React.createClass({
    contextTypes:{
        menuDesc:React.PropTypes.object.isRequired,
    },
    render:function(){
        return <div>{this.context.menuDesc}</div>
    }
});
var NormalMenuComponent = React.createClass({
    contextTypes:{
        setStateFromChildren:React.PropTypes.func.isRequired,
        skill               :React.PropTypes.object.isRequired,
        settings            :React.PropTypes.object.isRequired,
        upload              :React.PropTypes.func.isRequired,
        download            :React.PropTypes.func.isRequired,
        setVolume           :React.PropTypes.func.isRequired,
        AudioEngine         :React.PropTypes.object.isRequired,
        currentScene        :React.PropTypes.string.isRequired,
        menuHint            :React.PropTypes.number.isRequired,
        mstState            :React.PropTypes.object.isRequired,
        robberSaveData      :React.PropTypes.object.isRequired,
    },
    getDefaultProps:function(){
    },
    getInitialState:function(){
        var menuType ='settings';
        if(this.context.menuHint){
            menuType = 'skill';
        }
        return{
            menuType:menuType,
            selectedSkill:null,
        }
    },
    componentWillMount:function(){
        this.context.setStateFromChildren({menuHint:0});
    },
    upload:function() {
        this.context.upload();
    },
    download:function() {
        this.context.download();
    },
    reopen:function(){
        if(confirm("是否重开存档"+localStorage.getItem('number'))){
            localStorage.setItem('saveData'+localStorage.getItem('number'),'');
            $('.ck').css('display','block');
            location.reload();
        }
    },
    selectSave1:function(){
        localStorage.setItem('number',1);
        $('.qhcd').css('display','block');
        location.reload();
    },
    selectSave2:function(){
        localStorage.setItem('number',2);
        $('.qhcd').css('display','block');
        location.reload();
    },
    selectSave3:function(){
        localStorage.setItem('number',3);
        $('.qhcd').css('display','block');
        location.reload();
    },
    selectSave4:function(){
        localStorage.setItem('number',4);
        $('.qhcd').css('display','block');
        location.reload();
    },
    selectSave5:function(){
        localStorage.setItem('number',5);
        $('.qhcd').css('display','block');
        location.reload();
    },
    export:function(){
        var data = new Object();
        data.number=localStorage.getItem('number');
        data.sort=localStorage.getItem('sort');
        data.autoSave=localStorage.getItem('autoSave');
        data.saveData1=localStorage.getItem('saveData1');
        data.saveData2=localStorage.getItem('saveData2');
        data.saveData3=localStorage.getItem('saveData3');
        data.saveData4=localStorage.getItem('saveData4');
        data.saveData5=localStorage.getItem('saveData5');
        var name = '生存世界存档.txt';
        exportRaw(JSON.stringify(data), name);
    },
    import:function(){
        var input_import=$('#import')
        input_import.click();
        input_import.change(function(){
            jsReadFiles(input_import[0].files);
        })
    },
    quitMenu:function(){
        this.context.setStateFromChildren({showMenu:''});
    },
    handleTab:function(menuType){
        this.setState({menuType:menuType});
    },
    handleSkillTab:function(skill){
        this.setState({selectedSkill:skill});
    },
    handleChange:function(type,sender){
        // var value =  ($('#'+type)[0].value);
        var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        // var value =  parseInt($('.scheduleInput_'+this.props.type)[0].value);
        var value =  (obj.value);
        var settings = this.context.settings;
        settings['save_' + type] = value;
        this.context.setStateFromChildren({settings:settings});
    },
    handleAuto:function(){
        var value =  ($('#autoSave')[0].value);
        var settings = this.context.settings;
        settings['autoSave'] = !settings['autoSave'];
        localStorage.setItem('autoSave',!localStorage.getItem('autoSave').bool());
        this.context.setStateFromChildren({settings:settings});
    },
    willUpload:function(){
        this.upload();
    },
    setSort:function(){
        var settings = this.context.settings;
        settings.sort = !settings.sort;
        localStorage.setItem('sort',!localStorage.getItem('sort').bool());
        this.context.setStateFromChildren({settings:settings});
    },
    render:function(){
        var menuType = this.state.menuType;
        var skill = this.context.skill;
        var selectedSkill = this.state.selectedSkill;
        function getSkillList(){
            if(getLength(skill)==0){
                return <p style = {{color:COLOR.YELLOW}}>你还没有习得任何技能</p>
            }
            var result = [];
            for(var attr in skill){
                if(!SKILL_DATA[attr].name)continue;
                result.push(<div className = 'btn skillItem' onClick = {this.handleSkillTab.bind(this,attr)} key = {SKILL_DATA[attr].name}>{SKILL_DATA[attr].name} &nbsp; {SKILL_DATA[attr].one?null:<span className = 'badge'>{skill[attr]}</span>}</div>)
            }
            return result;
        }
        function getSkillDesc(){
            selectedSkill = selectedSkill||(getFirst(skill) && getFirst(skill).attr)||null;
            if(!selectedSkill)return null;

            function getAmount(){
                var lv = skill[selectedSkill];
                var buffTotal = lv * SKILL_DATA[selectedSkill].buff;
                var desc_1,desc_2;
                switch(selectedSkill){
                    case 'greedy'  :
                    case 'durable' :
                    case 'physique':
                    case 'lucky'   :
                    case 'fighter' :
                        desc_1 = '当前加成:';
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'magic'  :
                        desc_1 = '当前魔法加成:';
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'melee'  :
                        desc_1 = '当前近战加成:';
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'shoot':
                        desc_1 = '当前远程加成:';
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'alco':
                        desc_1 = '当前酿酒加成:';
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'farm' :
                        desc_1 = '当前种植收益加成:'
                        desc_2 = Math.round(100 * buffTotal) + '%';
                        break;
                    case 'def'  :
                        var buffTotal =  100 - Math.round(100 * (Math.pow(SKILL_DATA[selectedSkill].buff,lv) * 0.95) + 0.05 * (10/(10 + lv)));
                        desc_1 = '当前伤害减免:';
                        desc_2 = (buffTotal) + '%';
                        break;
                    case 'agile':
                        desc_1 = '当前射程加成:';
                        desc_2 = buffTotal;
                        break;
                }
                return <p>{desc_1}<span style = {{color:COLOR.GREEN}}>{desc_2}</span></p>
            }
            return <div>
                        <p>{SKILL_DATA[selectedSkill].desc}</p>
                        {getAmount.bind(this)()}
                    </div>
        }
        function getMenu(){
            switch(menuType){
                case'skill':
                return (
                    <div className = 'skillMenu'>
                        <div className = 'skill panel panel-primary'>
                            <div className = 'panel-heading'>所有技能</div>
                            <div className = 'panel-body'>
                                {getSkillList.bind(this)()}
                            </div>
                        </div>
                        <div className = 'skill panel panel-primary'>
                            <div className = 'panel-heading'>描述</div>
                            <div className = 'panel-body' style = {{padding:'5px'}}>
                                {getSkillDesc.bind(this)()}
                            </div>
                        </div>
                    </div>
                )
                break;
                case'settings':
                var settings = this.context.settings;
                return (
                    <div className = 'skillMenu'>
                        <div style = {{marginTop:10}}>
                            {/* <div>
                                <label htmlFor="account">账号</label>
                                <input onChange = {this.handleChange.bind(this,'account')} type="text" className = "form-control" id="account" value = {settings.save_account}></input>
                                <label htmlFor="pass">密码</label>
                                <input onChange = {this.handleChange.bind(this,'pass')} type="password" className = "form-control" id="pass" value = {settings.save_pass}></input>
                            </div> */}
                            <div>
                                <p className='cdcg' style = {{color:'#74AB6A',display:'none'}}>🌈存档成功,又是一个里程碑~🌈</p>
                                <p className='ddcg' style = {{color:'#74AB6A',display:'none'}}>🔥读档成功,请稍后...🔥</p>
                                <p className='ddsb' style = {{color:'red',display:'none'}}>🤐当前存档为空🤐</p>
                                <p className='ck' style = {{color:'#B25242',display:'none'}}>存档重开中,请等待页面刷新~</p>
                                <p className='qhcd' style = {{color:'#B25242',display:'none'}}>正在切换存档,请等待页面刷新~</p>
                                <p className='dc' style = {{color:'#74AB6A',display:'none'}}>🎃导出成功~请保存好存档文件🎃</p>
                                <p className='dr' style = {{color:'#74AB6A',display:'none'}}>🏆导入成功~请等待页面刷新🏆</p>
                                {this.context.currentScene != 'home'?<p style = {{color:'#ddd'}}>在家才能保存哦。。。</p>:null}
                                {getLength(this.context.mstState) != 0?<p style = {{color:'#ddd'}}>战斗中不能保存哦。。。</p>:null}
                                {this.context.robberSaveData.robber?<p style = {{color:'#ddd'}}>你正处于危险之中。。。</p>:null}
                                <BtnComponent disabled = {this.context.currentScene != 'home' || (getLength(this.context.mstState) != 0)||(this.context.robberSaveData.robber)} handleClick = {this.willUpload}>存档</BtnComponent>
                                <BtnComponent handleClick = {this.download}>读档</BtnComponent>
                                <BtnComponent handleClick = {this.reopen}>重开</BtnComponent>
                                <BtnComponent handleClick = {this.export}>导出</BtnComponent>
                                <input id='import' style={{display:'none'}} type="file"/>
                                <BtnComponent handleClick = {this.import}>导入</BtnComponent>
                            </div>
                            <div>请选择你的存档：</div>
                            <div className='saveList'>
                                <div className={'save1'+(localStorage.getItem("number")=='1'?' onSave':'')} onClick={this.selectSave1}>
                                    <div>存档1</div>
                                    {(localStorage.getItem('saveData1')==null||localStorage.getItem('saveData1')=='')?
                                        <div className='saveBody'>空</div>:
                                        <div className='saveBody'>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).season)=='"spring"'?
                                                '春季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).season)=='"summer"'?
                                                '夏季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).season)=='"autumn"'?'秋季':'冬季'))}
                                            </div>
                                            <div>{'第'+JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.day)+'日'}</div>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<5?
                                            '凌晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<10?
                                            '早晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<13?
                                            '中午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<17?
                                            '下午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<19?
                                            '傍晚':(JSON.stringify(JSON.parse(localStorage.getItem('saveData1')).time.hour)<22?
                                            '晚上':'深夜'
                                            )))))+parseInt(JSON.parse(localStorage.getItem('saveData1')).time.hour)+'点'}
                                            </div>
                                            <div>{'生命:'+Math.ceil(JSON.parse(localStorage.getItem('saveData1')).playerState.hp.amount)}</div>
                                        </div>
                                    }
                                </div>
                                <div className={'save2'+(localStorage.getItem("number")=='2'?' onSave':'')} onClick={this.selectSave2}>
                                    <div>存档2</div>
                                    {(localStorage.getItem('saveData2')==null||localStorage.getItem('saveData2')=='')?
                                        <div className='saveBody'>空</div>:
                                        <div className='saveBody'>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).season)=='"spring"'?
                                                '春季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).season)=='"summer"'?
                                                '夏季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).season)=='"autumn"'?'秋季':'冬季'))}
                                            </div>
                                            <div>{'第'+JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.day)+'日'}</div>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<5?
                                            '凌晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<10?
                                            '早晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<13?
                                            '中午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<17?
                                            '下午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<19?
                                            '傍晚':(JSON.stringify(JSON.parse(localStorage.getItem('saveData2')).time.hour)<22?
                                            '晚上':'深夜'
                                            )))))+parseInt(JSON.parse(localStorage.getItem('saveData2')).time.hour)+'点'}
                                            </div>
                                            <div>{'生命:'+Math.ceil(JSON.parse(localStorage.getItem('saveData2')).playerState.hp.amount)}</div>
                                        </div>
                                    }
                                </div>
                                <div className={'save3'+(localStorage.getItem("number")=='3'?' onSave':'')} onClick={this.selectSave3}>
                                    <div>存档3</div>
                                    {(localStorage.getItem('saveData3')==null||localStorage.getItem('saveData3')=='')?
                                        <div className='saveBody'>空</div>:
                                        <div className='saveBody'>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).season)=='"spring"'?
                                                '春季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).season)=='"summer"'?
                                                '夏季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).season)=='"autumn"'?'秋季':'冬季'))}
                                            </div>
                                            <div>{'第'+JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.day)+'日'}</div>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<5?
                                            '凌晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<10?
                                            '早晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<13?
                                            '中午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<17?
                                            '下午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<19?
                                            '傍晚':(JSON.stringify(JSON.parse(localStorage.getItem('saveData3')).time.hour)<22?
                                            '晚上':'深夜'
                                            )))))+parseInt(JSON.parse(localStorage.getItem('saveData3')).time.hour)+'点'}
                                            </div>
                                            <div>{'生命:'+Math.ceil(JSON.parse(localStorage.getItem('saveData3')).playerState.hp.amount)}</div>
                                        </div>
                                    }
                                </div>
                                <div className={'save4'+(localStorage.getItem("number")=='4'?' onSave':'')} onClick={this.selectSave4}>
                                    <div>存档4</div>
                                    {(localStorage.getItem('saveData4')==null||localStorage.getItem('saveData4')=='')?
                                        <div className='saveBody'>空</div>:
                                        <div className='saveBody'>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).season)=='"spring"'?
                                                '春季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).season)=='"summer"'?
                                                '夏季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).season)=='"autumn"'?'秋季':'冬季'))}
                                            </div>
                                            <div>{'第'+JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.day)+'日'}</div>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<5?
                                            '凌晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<10?
                                            '早晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<13?
                                            '中午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<17?
                                            '下午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<19?
                                            '傍晚':(JSON.stringify(JSON.parse(localStorage.getItem('saveData4')).time.hour)<22?
                                            '晚上':'深夜'
                                            )))))+parseInt(JSON.parse(localStorage.getItem('saveData4')).time.hour)+'点'}
                                            </div>
                                            <div>{'生命:'+Math.ceil(JSON.parse(localStorage.getItem('saveData4')).playerState.hp.amount)}</div>
                                        </div>
                                    }
                                </div>
                                <div className={'save5'+(localStorage.getItem("number")=='5'?' onSave':'')} onClick={this.selectSave5}>
                                    <div>存档5</div>
                                    {(localStorage.getItem('saveData5')==null||localStorage.getItem('saveData5')=='')?
                                        <div className='saveBody'>空</div>:
                                        <div className='saveBody'>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).season)=='"spring"'?
                                                '春季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).season)=='"summer"'?
                                                '夏季':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).season)=='"autumn"'?'秋季':'冬季'))}
                                            </div>
                                            <div>{'第'+JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.day)+'日'}</div>
                                            <div>{JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<5?
                                            '凌晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<10?
                                            '早晨':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<13?
                                            '中午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<17?
                                            '下午':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<19?
                                            '傍晚':(JSON.stringify(JSON.parse(localStorage.getItem('saveData5')).time.hour)<22?
                                            '晚上':'深夜'
                                            )))))+parseInt(JSON.parse(localStorage.getItem('saveData5')).time.hour)+'点'}
                                            </div>
                                            <div>{'生命:'+Math.ceil(JSON.parse(localStorage.getItem('saveData5')).playerState.hp.amount)}</div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <label className = "checkbox" htmlFor="autoSave">
                            <input checked = {this.context.settings.autoSave} onChange = {this.handleAuto} id="autoSave" type="checkbox" />
                            <span>出门时保存</span>
                        </label>
                        <BtnComponent handleClick = {this.context.setVolume}>声音：{this.context.AudioEngine.on?'开':'关'}</BtnComponent>
                        <BtnComponent handleClick = {this.setSort}>自动整理背包：{this.context.settings.sort?'开':'关'}</BtnComponent>
                        <div><a target="blank" href = "https://nianhua.plus">年华的小站</a></div>
                    </div>
                )
            }
        }
        return  <div className = 'menuOuter'>
                    <div className = 'menuInner'>
                        <div className = 'menu'>
                            <div className = 'menuMain'>
                                {getMenu.bind(this)()}
                            </div>
                            <ul className="nav">
                                <div className='btn' onClick = {this.handleTab.bind(this,'skill')}>技能</div>
                                <div className='btn' onClick = {this.handleTab.bind(this,'settings')}>设置</div>
                                <div className='btn' onClick = {this.quitMenu}>返回</div>
                            </ul>
                        </div>
                    </div>
                </div>
    }
});
var MenuComponent = React.createClass({
    contextTypes:{
        showMenu            :React.PropTypes.string.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        skill               :React.PropTypes.object.isRequired,
    },
    render:function(){
        var type = this.context.showMenu;
        if(!type || type == '')return null
        switch(type){
            case 'menu':
            var inner = <NormalMenuComponent />
            break;
            case 'custom':
            var inner = <CustomMenuComponent />
        }
        return <div className = 'menuOuter'>
                    <div className = 'menuInner'>
                        <div className = 'menu'>
                            <div className = 'menuMain'>
                                {inner}
                            </div>
                        </div>
                    </div>
                </div>
    }
});

//outer components
//中组件
var UpgradePlaceComponent = React.createClass({
    contextTypes:{
        skill:React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        useTime:React.PropTypes.func.isRequired,
    },
    getInitialState:function(){
        return{
            teacher:false,
        }
    },
    handleDone:function(type) {
        var skillType = EVENT_DATA[type].skill;
        var skill = this.context.skill;
        skill[skillType] = (skill[skillType]||0) + 1;
        this.context.useTime(function(){
            this.context.setStateFromChildren({skill:skill});
            this.context.setStateFromChildren({menuHint:1},true);
            this.setState({rewarding:true});
        }.bind(this),0.1);
    },
    getTeathers:function(){
        var list = {
            meleeUpgrade:true,
            shootUpgrade:true,
            magicUpgrade:true,
            agileUpgrade:true,
            defUpgrade:true,
            farmUpgrade:true,
            alcoUpgrade:true,
        }
        var skill = this.context.skill;
        var result = [];
        for(var attr in list){
            var itemList = EVENT_DATA[attr].want || {gold:10};
            var skillType  = EVENT_DATA[attr].skill;
            var level = skill[skillType];
            itemList = cloneMul(itemList,((1+1 *level)*(1+0.001 *level)),true);
            if(EVENT_DATA[attr]){
                result.push(<tr key = {attr}>
                                <td>{EVENT_DATA[attr].name}</td>
                                <td>{SKILL_DATA[skillType].name}</td>
                                <td><GiveComponent itemList = {itemList} onDone = {this.handleDone.bind(null,attr)}/></td>
                            </tr>)
            }
        }
        return result;
    },
    handleTeacherWindow:function(teacher){
        this.setState({teacher:teacher})
    },
    render:function(){
        if(this.state.teacher){
            return  <div>
                        <TeacherComponent type = {this.state.teacher}/>
                        <BtnComponent desc= '返回' handleClick = {this.handleTeacherWindow.bind(null,null)}/>
                    </div>
        }
        return  <div>
                    <div className = "tableOuter" style = {{margin:'auto',width:350,height:300}}>
                        <table className="table table-condensed table-hover">
                            <thead>
                                <tr><td>教师</td><td>内容</td><td>学费</td></tr>
                            </thead>
                            <tbody>
                                {this.getTeathers()}
                            </tbody>
                        </table>
                    </div>
                    <BtnHome placeName = {'upgradePlace'}/>
                </div>

    }
})


var RegisterComponent = React.createClass({
    //寄存器，用于存放获得物品
    getDefaultProps:function(){
        return {
            itemList:null,
            willUnmount:null,
            canPick:true,//显示'全部拾取'
            canBack:true,//显示'返回'
            canBeEmpty:false,//为空时自动返回
        }
    },
    contextTypes:{
        boxSaveData         :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        checkFull           :React.PropTypes.func.isRequired,
        changeItem          :React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
    },
    componentWillMount:function(){
        var itemList = this.props.itemList;
        if(!itemList){
            return;
        }
        var saveData = this.context.boxSaveData;
        saveData.register.things = cloneMul(itemList,1);
        this.context.setStateFromChildren({boxSaveData:saveData});
    },
    componentWillUnmount:function(){
        // if(this.props.willUnmount){
        //     this.props.willUnmount();
        // }
    },
    grabAll:function(){
        var saveData = this.context.boxSaveData;
        var itemList = saveData.register.things;
        for(var attr in itemList){
            if(!this.context.checkFull('bag',attr)){
                this.context.changeItem(o(attr,itemList[attr]),'bag');
                this.context.changeItem(o(attr,itemList[attr]),'register',true);
            }
        }
        this.context.setStateFromChildren({boxSaveData:saveData});
        this.check();
    },
    check:function(){
        if(this.props.canBeEmpty == true)return;
        var saveData = this.context.boxSaveData;
        var itemList = saveData.register.things;
        if(getLength(itemList) == 0){
            this.context.callWindow(null);
            this.props.willUnmount && this.props.willUnmount();
        }
    },
    render:function(){
        var things = this.context.boxSaveData.register.things;
        var disabled = (getLength(things)== 0);
        return  <div>
                    {this.props.canBack?<BtnBack callBack = {this.props.willUnmount || null}/>:null}
                    <BoxComponent isRegister = {true} box = 'register' itemList = {things} handleClick = {this.check}/>
                    {this.props.canPick?<BtnComponent sound = 'pickall' disabled = {disabled} handleClick = {this.grabAll} desc = '全部拾取'/>:null}
                </div>
    }
});
var BagComponent = React.createClass({
    contextTypes:{
        getScienceLevel:React.PropTypes.func.isRequired,
        boxSaveData    :React.PropTypes.object.isRequired,
        detailedItem   :React.PropTypes.string.isRequired,
        detailedType   :React.PropTypes.string.isRequired,
        detailedList   :React.PropTypes.array.isRequired,
        durableSaveData:React.PropTypes.object.isRequired,
        getMaxDurable  :React.PropTypes.func.isRequired,
        getTempDesc    :React.PropTypes.func.isRequired,
        currentEquip   :React.PropTypes.object.isRequired,
        playerState    :React.PropTypes.object.isRequired,
        handleItemClick:React.PropTypes.func.isRequired,
        currentBox     :React.PropTypes.string.isRequired,
    },
    getDefaultProps:function(){
        return {
            items:[],
            size:1,
            msg:'',
            changeMsg:null
        };
    },
    componentWillMount:function(){
        var level = this.context.getScienceLevel('bagSizeBonus');
        var boxSaveData = this.context.boxSaveData;
        boxSaveData['bag'].size = BAG_BASE_SIZE + level;
    },
    getItemBoxFromDetail:function(){
        var detailedItem = this.context.detailedItem;
        var boxSaveData = this.context.boxSaveData;
        var currentBox = this.context.currentBox;
        var box;
        if(boxSaveData.bag.things[detailedItem]){
            box = 'bag';
        }else{
            if(currentBox && boxSaveData[currentBox].things[detailedItem]){
                box = currentBox;
            }else{
                box = false;
            }
        }
        return box;
    },
    useItemFromDetail:function(){
        var detailedItem = this.context.detailedItem;
        this.context.handleItemClick(detailedItem,this.getItemBoxFromDetail());
    },
    render:function() {
        var detailedType = this.context.detailedType;
        var detailedItem = this.context.detailedItem;
        var detailedList = this.context.detailedList;
        function getItemDetail(){
            if(!detailedItem)return null;
            var type = ITEM_DATA[detailedItem].type;
            //装备的处理
            var currentEquip = this.context.currentEquip;
            var equipShow = null;
            var equipType = ITEM_DATA[detailedItem].equipType;
            if(equipType){
                if(currentEquip[equipType] != detailedItem){
                    equipShow = <span style = {{color:COLOR.RED}}>右键装备</span>;
                }else{
                    equipShow = <span style = {{color:COLOR.GREEN}}>已装备</span>;
                }
            }
            function getDetailDesc(){
                if(ITEM_DATA[detailedItem].effect){
                    var res = [];
                    for (var attr in ITEM_DATA[detailedItem].effect) {
                        var effectAmount = ITEM_DATA[detailedItem].effect[attr];

                        var prefix = effectAmount > 0?'+':'';
                        var isGreen;
                        if(attr == 'temp'){
                            isGreen = (this.context.playerState['temp'].amount>0)!=(effectAmount>0);
                        }else{
                            isGreen = (effectAmount > 0);
                        }
                        res.push(<span key = {attr} className = {'detailVector '+(isGreen?"effectPlus":"effectMinus")}>{STATE_DATA[attr].name}:{prefix}{effectAmount}</span>)
                    };
                    return <p>{res}</p>
                }else{
                    return null
                }
            }
            var maxDurable = ITEM_DATA[detailedItem].durable && this.context.getMaxDurable(detailedItem);//总耐久
            var durable = this.context.durableSaveData[detailedItem];//已使用耐久
            var damage = ITEM_DATA[detailedItem].damage;//伤害
            return  <div className = "detailHead">
                        <p className = "detailVector effectHeading clearFix">
                            {ITEM_DATA[detailedItem].name}
                        </p>
                        {equipType?<p className = "detailVector effectHeading clearFix">{EQUIP_TYPE_DATA[equipType]}</p>:null}
                        <p className = "detailVector effectHeading clearFix">
                            {equipShow || TYPE_DATA[ITEM_DATA[detailedItem].type].name}
                        </p>
                        {(!IS_IPAD && ITEM_DATA[detailedItem].canUse)?<p className = "detailVector effectHeading clearFix" >右键使用</p> : null}
                        {damage != undefined?<div className = "detailVector effectHeading clearFix" >伤害：{damage}</div> : null}
                        {maxDurable != undefined?<div className = "detailVector effectHeading clearFix" >耐久度：{maxDurable - durable}/{maxDurable}</div> : null}
                        <div className = "detailVector detailDesc">
                            {ITEM_DATA[detailedItem].desc}
                            {(IS_IPAD && ITEM_DATA[detailedItem].canUse)?<BtnComponent disabled = {!this.getItemBoxFromDetail()} handleClick = {this.useItemFromDetail}>使用</BtnComponent>:null}
                            {(IS_IPAD && ITEM_DATA[detailedItem].equipType )?<BtnComponent disabled = {this.getItemBoxFromDetail()!='bag'} handleClick = {this.useItemFromDetail}>装备</BtnComponent>:null}
                        </div>
                        {getDetailDesc.bind(this)()}
                    </div>
        }
        var tempDesc = this.context.getTempDesc();
        function getStateDetail(){
            var name = STATE_DATA[detailedItem].name;
            if(detailedItem == 'temp'){
                var desc = <div>
                                <p>{TEMP_DATA[tempDesc].desc}</p>
                            </div>
            }else{
                var desc = STATE_DATA[detailedItem].desc;
            }
            return  <div className = "detailHead">
                        <span className = 'detailVector effectHeading clearFix'>{name}</span>
                        {detailedItem == 'temp'?<span className = 'detailVector effectHeading clearFix'>{TEMP_DATA[tempDesc].name}</span> :null}
                        <div className = "detailVector detailDesc">
                            {desc}
                        </div>
                    </div>
        }
        function getDescDetail(){
            var result = [];
            for (var i = 0; i < detailedList.length; i++) {
                result.push(detailedList[i]);
            };
            return  <div className = "detailHead">
                        <div className = "detailVector detailDesc">
                            {result}
                        </div>
                    </div>
        }
        function getDetail(){
            switch(detailedType){
                case 'item':return getItemDetail.bind(this)();
                case 'state':return getStateDetail.bind(this)();
                case 'desc':return getDescDetail.bind(this)();
            }
            return false;
        }
        return  <div className="panel panel-primary equipMain">
                    <div className="panel-heading">
                        背包
                    </div>
                    <div className="panel-body  clearFix">
                        <div className = "equip" id = "equip">
                            <BoxComponent box = 'bag'/>
                        </div>
                        <div className = "detail" id = "detail">
                            {getDetail.bind(this)()}
                        </div>

                    </div>
                </div>
    }
});
var StateComponent = React.createClass({
    render:function(){
        function getStatesName(){
            var result = [];
            for(var attr in PLAYER_STATE_INIT){
                result.push(<StateVectorComponent key = {attr} state = {attr}/>);
            }
            return result;
        }
        return  <div className="stateMain">
                    {getStatesName()}
                    <MenuBtnComponent />
                    {MODE=='DEBUG'?<DebugComponent/>:null}
                </div>
    }
})
var ScienceComponent = React.createClass({
    contextTypes:{
        getScienceLevel     :React.PropTypes.func.isRequired,
        buildingSaveData    :React.PropTypes.object.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
    },
    onUpdate:function(name){
        var level = this.context.getScienceLevel('bagSizeBonus');
        var boxSaveData = this.context.boxSaveData;
        boxSaveData['bag'].size = BAG_BASE_SIZE + level;
    },
    render:function(){
        return <StudioComponent onUpdate = {this.onUpdate} type = 'scienceTable' alwayMakeOne = {true} attachData = {SCIENCE_DATA} />
    }
})
var StudioComponent = React.createClass({
    contextTypes:{
        buildingSaveData    : React.PropTypes.object.isRequired,
        boxSaveData         : React.PropTypes.object.isRequired,
        useTime             : React.PropTypes.func.isRequired,
        changeItem          : React.PropTypes.func.isRequired,
        useItemThatPlayerHave: React.PropTypes.func.isRequired,
        useItem             : React.PropTypes.func.isRequired,
        getMaxTimeOfRequire : React.PropTypes.func.isRequired,
        checkHaveResourceAll: React.PropTypes.func.isRequired,
        getTheMaxTimeToUse  : React.PropTypes.func.isRequired,
        getScienceLevel     : React.PropTypes.func.isRequired,
        getBuildingLevel    : React.PropTypes.func.isRequired,
        setStateFromChildren: React.PropTypes.func.isRequired,
        checkFull           : React.PropTypes.func.isRequired,
        AudioEngine         : React.PropTypes.object.isRequired,
        eventSaveData       : React.PropTypes.object.isRequired,
    },
    getDefaultProps:function(){
        return {
            attachData:null,
            type:null,
            isBuildingUpdate:false,
            onUpdate:null
        }
    },
    getInitialState:function(){
        return {
            itemToMake:null,
            displayWindow:false,
            makeAmount:1,
            cookAmount:1,
            makeAmountMax:1,
            require:null,
            alwayMakeOne:false,
        }
    },
    getTimeNeed:function(timeNeed){
        if(this.props.attachData != MAKE_DATA)return timeNeed;
        var level = this.context.getScienceLevel('makeSpeed');
        return Math.pow(MAKE_SPEED_MUL,level) * timeNeed;
    },
    make:function(name){
        var data = this.props.attachData[name];
        var amount = this.state.makeAmount;
        this.context.useItemThatPlayerHave(cloneMul(data.require,amount));
        function callBack(){
            this.context.changeItem(o(name,amount * (data.amount || 1)),this.props.type);
            // setTimeout((function(){
                if(this.props.alwayMakeOne){
                    this.setState({displayWindow:null});
                    if(this.props.onUpdate){
                        this.props.onUpdate(name);
                    }
                }else{
                    this.updateSchedule();
                }
                if(!this.props.alwayMakeOne)this.makeWindow(name);

            // }).bind(this),0);
        }
        this.context.useTime(callBack.bind(this),this.getTimeNeed(data.timeNeed * amount));
        if(data.timeNeed * amount > 2)this.context.AudioEngine.playEffect('build');
    },
    updateBuilding:function(name){
        var data = BUILDING_UPDATE_DATA[this.props.type][name];
        var o = {};
        o[name] = 1;
        this.context.useItemThatPlayerHave(data.require);
        function callBack(){
            this.context.changeItem(o,this.props.type);
            if(this.props.onUpdate){
                this.props.onUpdate(name);
            }
        }
        this.context.useTime(callBack.bind(this),data.timeNeed);
        if(data.timeNeed > 2)this.context.AudioEngine.playEffect('build');
    },
    makeWindow:function(name){
        var require = this.props.attachData[name].require;
        this.context.AudioEngine.playEffect('open');
        this.setState({
            itemToMake:name,
            makeAmount:1,
            displayWindow:true,
            require:require,
            makeAmountMax:this.context.getMaxTimeOfRequire(require)
        });
    },
    updateSchedule:function(sender){
        // var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        var value =  parseInt($('.scheduleInput')[0].value) ;
        // var value =  parseInt(obj.value);
        if(isNaN(value))value = 1;
        if(value > this.state.makeAmountMax)value = this.state.makeAmountMax;
        if(value < 1)value = 1;
        var maxTime = this.context.getTheMaxTimeToUse();
        var maxAmount = Math.floor(maxTime/this.getTimeNeed(this.props.attachData[this.state.itemToMake].timeNeed)|| 1) ;
        if(value > maxAmount)value = maxAmount;
        this.setState({makeAmount:value});
    },
    getCookResult:function(){
        var metList = this.context.boxSaveData.cooker.things;
        if(getLength(metList)<2)return false;
        for (var i = COOK_DATA.length - 1; i >= 0; i--) {
            var require = COOK_DATA[i].require;
            if(require.length == 1){
                var flag = false;
                for (var attr in metList) {
                    if(attr == require[0]){
                        flag = true;
                        break;
                    }
                }
            }else{
                flag = true;
                for (var attr in metList) {
                        if(!(require[0] == attr||require[1] == attr)){
                            flag = false;
                            break;
                        }
                    }
            }
            if(flag)return COOK_DATA[i].name;
        };
        return false;
    },
    checkMaxCookAmount:function(){
        var max = Math.floor(this.context.getTheMaxTimeToUse() * this.state.cookAmount/this.getCookTime());
        var met = this.context.boxSaveData.cooker.things;
        for(var attr in met){
            if(max > met[attr])max = met[attr];
        }
        return max;
    },
    changeCookAmount:function(sender){
        var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        // var value =  parseInt($('.scheduleInput')[0].value) ;
        var value =  parseInt(obj.value);
        if(isNaN(value))value = 1;
        if(value < 1)value = 1;

        var max = this.checkMaxCookAmount();
        if(value > max){
            value = max;
        }
        this.setState({cookAmount:value});
    },
    getCookTime:function(){
        var amount = this.state.cookAmount;
        var level = this.context.getBuildingLevel('cookerUpdate');
        var result = amount * COOK_TIME_NEED * (Math.pow(COOK_SPEED_MUL,level));
        return result;
    },
    handleCook:function(){
        var met = this.context.boxSaveData.cooker.things;
        var cookResult = this.getCookResult();
        var amount = this.state.cookAmount;
        function callBack(){
            var o = {};
            for (var attr in met) {
                o[attr] = amount;
            };
            this.context.useItem(o,'cooker');
            o = {};
            o[cookResult] = amount;
            this.context.changeItem(o,'cooked');
            this.setState({cookAmount:1});
        }
        this.context.useTime(callBack.bind(this),this.getCookTime());
    },
    render:function(){
        // return <p></p>;
        var type = this.props.type;//选择类型，名称为对于的成品箱子名称
        if(this.props.isBuildingUpdate){
            //建筑升级的情况
            var result = getUpdateDesc.bind(this)();
            if(!result)return null;
            return  <div>
                        <div className = 'updateOuter'>
                            <div className = "studioTableOuter" style = {{maxHeight:this.state.displayWindow?'200px':(324 - 52 -58+46) +'px'}}>
                                <table className="table table-condensed table-hover ">
                                    <tbody>
                                        {result}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
        }else{
            //生产的情况
            var attachData = this.props.attachData;
            var boxList = this.context.boxSaveData;//选择箱子
            var box = boxList[type];

            //烹调的情况
            if(type == 'cooked'){
                var cookResult = this.getCookResult();
                var disabled = (this.context.getTheMaxTimeToUse() < 1)||(this.state.cookAmount == 0)||(this.state.cookAmount > this.checkMaxCookAmount());
                if(!cookResult){
                    return <div></div>;
                }
                return <div style = {{width:'100%',height:'100%'}}>
                            <div className = ''>
                                <div className = "tableOuter">
                                    <table className="table table-condensed table-hover ">
                                        <tbody>
                                            <tr>
                                                <td>{ITEM_DATA[cookResult].name}</td>
                                                <td>{ITEM_DATA[cookResult].desc}</td>
                                                <td><input className = 'scheduleInput form-control' value = {String(this.state.cookAmount)} type = 'number' onChange = {this.changeCookAmount}/></td>
                                                <td>耗时:{Math.round(this.getCookTime())}</td>
                                                <td><BtnComponent disabled = {disabled} desc = '烹调' handleClick = {this.handleCook}/></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
            }
            var result = getMakeDesc.bind(this)();

            return <div style = {{width:'100%',height:'100%'}}>
                        <div className = 'viewOuter'>
                            <div className = "tableOuter studioTableOuter" style = {{maxHeight:this.state.displayWindow?'200px':(324 - 52 -58+46) +'px'}}>
                                <table className="table table-condensed table-hover ">
                                    <thead><tr><td>成品</td><td>需求</td><td>描述</td></tr></thead>
                                    <tbody>
                                        {result}
                                    </tbody>
                                </table>
                            </div>
                            <div className = 'studioBottom' >
                                {this.state.displayWindow?schedule.bind(this)():''}
                                {this.props.alwayMakeOne?null:<BoxComponent box = {this.props.type}/>}
                                <BtnBack/>
                            </div>
                        </div>
                    </div>
        }
        function haveTimeToMake(item){
            var item = item || this.state.itemToMake;
            return this.context.getTheMaxTimeToUse() >= (this.props.attachData||BUILDING_UPDATE_DATA[type])[item].timeNeed
        }
        function getUpdateDesc(){
            var list = BUILDING_UPDATE_DATA[type];
            var result = [];
            var count = 0;
            for (var attr in  list) {
                var tmp = list[attr];
                if(this.context.boxSaveData[type].things[attr])continue;
                //科技类的物品的检查
                if(BUILDING_UPDATE_DATA[type][attr].science  && !this.context.boxSaveData[type].things[BUILDING_UPDATE_DATA[type][attr].science])continue;
                var disabled = !this.context.checkHaveResourceAll(tmp.require,true) || !haveTimeToMake.bind(this,attr)();
                result.push(<tr key = {'update' + count}>
                                <td>{ITEM_DATA[attr].name}</td>
                                <td><RequireComponent requireList = {tmp.require} haveBox = {true}/></td>
                                <td>{ITEM_DATA[attr].desc}</td>
                                <td>
                                    <BtnComponent disabled = {disabled} handleClick = {this.updateBuilding.bind(this,attr)} desc = "升级" />
                                </td>
                            </tr>);
                count ++;
            };
            if(count == 0)return false;
            return result;
        }
        function getMakeDesc(){
            var list = attachData;
            var result = [];
            var count = 0;
            for (var attr in  list) {
                var tmp = list[attr];
                //只需一次的，科技类的物品的检查
                if(this.props.alwayMakeOne && this.context.boxSaveData[type].things[attr])continue;
                //需要科技的情况的检查
                if(attachData[attr].science  && !this.context.boxSaveData['scienceTable'].things[attachData[attr].science])continue;
                //需要事件的情况的检查
                if(attachData[attr].event  && !this.context.eventSaveData[attachData[attr].event].experienced)continue;
                //需要建筑的情况的检查
                if(tmp.building && !this.context.buildingSaveData[tmp.building].own)continue;
                // var isFull =  !( (box.size > getLength(box.things)) || (box.things[attr] != undefined) );
                result.push(<tr onClick = {this.makeWindow.bind(this,attr)} key = {'make' + count}>
                                <td>{ITEM_DATA[attr].name}{list[attr].amount?' * '+list[attr].amount:null}</td>
                                <td><RequireComponent requireList = {tmp.require} haveBox = {true}/></td>
                                <td>{ITEM_DATA[attr].desc}</td>
                            </tr>);
                count ++;
            };
            if(count == 0)return false;
            return result;
        }
        function schedule(){
            var name = this.state.itemToMake;
            var amount = this.state.makeAmount;
            var require = this.props.attachData[name].require;
            var totalRequire = cloneMul(require,amount);
            //检查产物寄存是否被占用
            var disabled = !this.context.checkHaveResourceAll(totalRequire,true) || !haveTimeToMake.bind(this,name)()||( !this.props.alwayMakeOne && this.context.checkFull(this.props.type,name));

            return  <div className = 'schedule'>
                            <table className="table table-hover ">
                                <thead><tr><td>清单</td>{this.props.alwayMakeOne?null:<td>个数</td>}<td>消耗</td><td>耗时</td><td></td></tr></thead>
                                <tbody><tr>
                                    <td>{ITEM_DATA[name].name}</td>
                                    {this.props.alwayMakeOne?null:<td><input className = 'scheduleInput form-control' value = {String(amount)} type = 'number' onChange = {this.updateSchedule}/></td>}
                                    <td><RequireComponent haveBox = {true} withSpace = {true} showTotal = {true} requireList = {totalRequire} /></td>
                                    <td>{Math.round(this.getTimeNeed(this.props.attachData[name].timeNeed * amount))}</td>
                                    <td><BtnComponent disabled = {disabled} handleClick = {this.make.bind(this,name)} desc = "执行" /></td>
                                </tr></tbody>
                            </table>
                    </div>
        }
    }
});
var BuildingComponent = React.createClass({
    //display the building btn ,the entry to your buildings
    //call window to get the building view
    getDefaultProps:function(){
        return {
            building:null,
        }
    },
    contextTypes:{
        callWindow      :React.PropTypes.func.isRequired,
        AudioEngine     :React.PropTypes.object.isRequired,
        boxSaveData     :React.PropTypes.object.isRequired,
        buildingSaveData:React.PropTypes.object.isRequired,
    },
    callWindow:function(wind){
        this.context.callWindow(wind);
    },
    handleClick:function(){
        this.context.AudioEngine.playEffect('pick');
        var buildingMap = {
            trap        :<TrapComponent/>,
            makeTable   :<StudioComponent type = 'makeTable' attachData = {MAKE_DATA}/>,
            alchemyTable:<StudioComponent type = 'alchemyTable' attachData = {ALCHEMY_DATA}/>,
            magicTable  :<StudioComponent type = 'magicTable' attachData = {MAGIC_DATA}/>,
            scienceTable:<ScienceComponent/>,
            build       :<BuildComponent/>,
            cooker      :<CookerComponent/>,
            well        :<WellComponent/>,
            bigBox      :<BigBoxComponent/>,
            farm        :<WaitMakeComponent building = 'farm' attachData = {CROP_DATA}/>,
            alco        :<WaitMakeComponent building = 'alco' attachData = {ALCO_DATA}/>,
            toilet      :<ToiletComponent/>,
            sleepPlace  :<SleepPlaceComponent/>,
        }
        var wind = buildingMap[this.props.building];
        this.callWindow(wind);
    },
    render:function(){
        var buildingSaveData = this.context.buildingSaveData;
        var building = this.props.building;
        return (
                <div onClick = {this.handleClick} className = 'building btn btn-default'>
                    {BUILDING_DATA[building].name}
                    {buildingSaveData[building].hint?<span className = 'badge'>!</span>:null}
                </div>
            );
    }
});
var ActionComponent = React.createClass({
    contextTypes:{
        getTheMaxTimeToUse  :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        useItemThatPlayerHave             :React.PropTypes.func.isRequired,
        playerStateChange   :React.PropTypes.func.isRequired,
        playerState         :React.PropTypes.object.isRequired,
        changeItem          :React.PropTypes.func.isRequired,
        checkHaveResourceAll:React.PropTypes.func.isRequired,
        setcoolDownSaveData   :React.PropTypes.func.isRequired,
        getcoolDownSaveData   :React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return{
            canGet:null,
            desc:'',
            timeNeed:1,
            changable:false,
            require:null,
            action:null,
            coolDown:null,
            disabled:false,
            props:{},
        }
    },
    getInitialState:function(){
        return{
            timeNeed:1
        }
    },
    updateSchedule:function(sender){
        var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        // var value =  parseInt($('.scheduleInput_'+this.props.type)[0].value);
        var value =  parseInt(obj.value);
        if(this.state.timeNeed == value)return;
        if(isNaN(value))value = 1;
        var max = this.context.getTheMaxTimeToUse();
        value =  max < value?max:value;
        value =  value < 1?1:value;
        this.setState({timeNeed:value},function(){
        });
    },
    act:function(){
        var timeNeed = this.state.timeNeed;
        var canGet = this.props.canGet;
        canGet = cloneMul(canGet,timeNeed);
        var require = cloneMul(this.props.require,this.state.timeNeed);
        var stateCanGet = {};
        for (var attr in canGet) {
            if(this.context.playerState[attr] != undefined){
                stateCanGet[attr] = canGet[attr];
                delete canGet[attr];
            }
        };
        for(var attr in canGet){
            canGet[attr] = Math.floor(canGet[attr]);
        }
        function callBack(){
            this.context.playerStateChange(stateCanGet);
            this.context.changeItem(canGet,'shit');
            this.context.useItemThatPlayerHave(require,'bag');
            if(this.props.coolDown){
                this.context.setcoolDownSaveData(this.props.action,this.props.coolDown);
            }
        }
        this.context.useTime(callBack.bind(this),timeNeed,this.props.props);
    },
    render:function(){
        var name = this.state.itemToMake;
        var amount = this.state.makeAmount;
        var canGet = this.props.canGet;
        canGet = cloneMul(canGet,this.state.timeNeed);
        for(var attr in canGet){
            canGet[attr] = Math.floor(canGet[attr]);
        }
        function getTimeDesc(){
            if (this.props.changable){
                return <input value = {this.state.timeNeed} className = {'scheduleInput form-control scheduleInput_'+this.props.type} type = 'number' onChange = {this.updateSchedule}/>
            }else{
                return <span>{this.props.timeNeed}</span>
            }
        }
        var require = this.props.require;
        var disabled = this.props.disabled || this.context.getTheMaxTimeToUse() < this.state.timeNeed || !this.context.checkHaveResourceAll(require,true);

        var coolDown = this.context.getcoolDownSaveData(this.props.action);
        var hasCooledDown = (coolDown == 0 || coolDown == undefined);
        return <div className = 'schedule'>
                            <table className="table table-hover ">
                                <thead><tr>{require?<td>需求</td>:null}<td>获得</td><td>耗时</td><td></td></tr></thead>
                                <tbody><tr>
                                    {require?<td><RequireComponent haveBox = {true} requireList = {cloneMul(require,this.state.timeNeed)}/></td>:null}
                                    <td><RequireComponent isGreen = 'true' requireList = {canGet}/></td>
                                    <td>{getTimeDesc.bind(this)()}</td>
                                    {hasCooledDown?<td><BtnComponent disabled = {disabled} handleClick = {this.act.bind(this,name)} desc = {this.props.desc} /></td>:<td><BtnComponent disabled = {true} desc = {this.props.desc + '(冷却:' + Math.round(coolDown) + ')'} /></td>}
                                </tr></tbody>
                            </table>
                    </div>
    }
});
var TrampComponent = React.createClass({
    maxFood:50,
    contextTypes:{
        getValue            :React.PropTypes.func.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        eventSaveData       :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        playerStateChange   :React.PropTypes.func.isRequired,
        setDueling          :React.PropTypes.func.isRequired,
        setEventExperienced :React.PropTypes.func.isRequired,
    },
    getInitialState:function(){
        return {
            over:false
        }
    },
    componentWillMount:function(){
        this.context.setDueling(true);
    },
    componentWillUnmount:function(){
        this.context.setDueling(false);
    },
    checkFood:function(){
        var playerGive = this.context.boxSaveData.register.things;
        var value = 0;
        for(var attr in  playerGive){
            if(ITEM_DATA[attr].type != 'food' && ITEM_DATA[attr].type != 'cooked')continue;
            if(ITEM_DATA[attr].isDrink){
                value += this.context.getValue(attr) * playerGive[attr] * 0.5;
            }else{
                value += this.context.getValue(attr) * playerGive[attr];
            }
        }
        return value;
    },
    giveFood:function(){
        var eventSaveData = this.context.eventSaveData;
        var value = this.checkFood();
        eventSaveData.tramp['foodGot'] += value;
        this.context.setStateFromChildren({eventSaveData:eventSaveData});
        //帮助乞丐，获得精神上的慰藉
        this.context.playerStateChange({san:value/5});
        this.setState({over:true})
        if(eventSaveData.tramp['foodGot'] > this.maxFood){
            this.context.setEventExperienced('tramp');
        }
    },
    render:function(){
        var playerGive = this.context.boxSaveData.register.things;
        var value = this.checkFood();
        var header = '-流浪汉-';
        var eventSaveData = this.context.eventSaveData;
        var foodGot = eventSaveData.tramp['foodGot'];
        if(!this.state.over){
            return <div>
                        <p>{header}</p>
                        {value == 0?(getLength(playerGive) == 0?<p>求你了，能不能给我一点食物。。。</p>:<p>拜托..我要食物啊...</p>):(foodGot + value> this.maxFood ? <p>太感谢了，上帝保佑你...</p> :<p>谢谢你...还有吗...</p>)}
                        <RegisterComponent itemList = {{}} canBack = {false} onlyOne = {true} canBeEmpty = {true} canPick = {false}/>
                        {value == 0?<BtnBack/>:<BtnComponent handleClick={this.giveFood} desc = {'施舍'} />}
                    </div>;
            }else{
                if(foodGot > this.maxFood){
                    return <div>
                                <p>{header}</p>
                                <p>我感觉好多了。</p>
                                <p>--------</p>
                                <p>流浪汉递给你一张<span style = {{color:COLOR.GREEN}}>[小镇]</span>的地图。</p>
                                <p>流浪汉扬长而去....</p>
                                <BtnBack/>
                            </div>;
                }else{
                    var sanGet = Math.ceil(value/5);
                    return <div>
                                <p>{header}</p>
                                <p>上帝保佑你...</p>
                                <p>如果你有更多的食物，我可以将通往小镇的地图跟你交换！</p>
                                {sanGet?<p>--------</p>:null}
                                {sanGet?<p>你获得了{<RequireComponent isGreen = {true} requireList = {{san:Math.ceil(value/5)}} />}</p>:null}
                                <BtnBack/>
                            </div>;
                }
            }
    }
});
var QuestComponent = React.createClass({
    contextTypes:{
        eventSaveData       :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        changeItem          :React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return{
            event:'',
            requireList:null,
            name:null,
            forever:false,//是否为永久任务
            callBack:null,
        }
    },
    getInitialState:function () {
        return{
            done:false,
        }
    },
    onDone:function(){
        this.setState({done:true});
        if(this.props.forever)return;
        var eventSaveData = this.context.eventSaveData;
        eventSaveData[this.props.event].experienced = true;
        this.context.setStateFromChildren({eventSaveData:eventSaveData});
        
        this.props.callBack && this.props.callBack();
    },
    onForeverDone:function(){
        var data = EVENT_DATA[this.props.event];
        var itemList = clone(data.get) || null;
        var chanceGet = data.chanceGet;
        if(chanceGet){
            for(var attr in chanceGet){
                if(Math.random() < chanceGet[attr]){
                    itemList[attr] = 1;
                }
            }
        }
        this.context.changeItem(itemList,'register');
    },
    render:function(){
        var data = EVENT_DATA[this.props.event];

        if(this.props.forever){
            return (
                    <div>
                        <p>-{this.props.name || data.name}-</p>
                        {this.props.children && this.props.children[0] || toParagraphs(data.d_1)}
                        <div>
                            <GiveComponent giveDesc = {data.giveDesc || null} onDone = {this.onForeverDone} itemList = {this.props.requireList||EVENT_DATA[this.props.event].want}/>
                        </div>
                        <RegisterComponent itemList = {{}}/>
                     </div>
                     )
        }
        if(this.state.done){
            if(data.mst){
                var callBack = function(){
                    this.context.callWindow(<BattleComponent mst = {data.mst}/>);
                }
            }else{
                var callBack = function(){
                }

            }
            var itemList = clone(data.get) || null;
            var chanceGet = data.chanceGet;
            if(chanceGet){
                for(var attr in chanceGet){
                    if(Math.random() < chanceGet[attr]){
                        itemList[attr] = 1;
                    }
                }
            }
            var learn = (data.learn) || null;
            var place = (data.place) || null;
            return (
                    <div>
                        {this.props.children && this.props.children[1] || data.d_2}
                        {itemList?<RegisterComponent canBack = {false} canBeEmpty = {true} itemList = {itemList} willUnmount = {callBack.bind(this)||null}/>:null}
                        {learn?<div><p>--------</p><p>你学会了[<span style = {{color:COLOR.YELLOW}}>{learn}</span>]的制作。</p></div>:null}
                        {place?<div><p>--------</p><p>在地图上标出了[<span style = {{color:COLOR.YELLOW}}>{place}</span>]的位置。</p></div>:null}
                        <BtnBack  callBack = {callBack.bind(this)||null}/>
                     </div>
                 )
        }
        return (
                <div>
                    <p>-{this.props.name || data.name}-</p>
                    {this.props.children && this.props.children[0] || toParagraphs(data.d_1)}
                    <div>
                        <GiveComponent giveDesc = {data.giveDesc || null} onDone = {this.onDone} itemList = {this.props.requireList||EVENT_DATA[this.props.event].want}/>
                    </div>
                    <BtnBack/>
                 </div>
                 )
    }
});
var GiveComponent = React.createClass({
    contextTypes:{
        boxSaveData         :React.PropTypes.object.isRequired,
        checkHaveResourceAll:React.PropTypes.func.isRequired,
        useItem             :React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return{
            event:'',
            onDone:null,
            itemList:null,
            giveDesc:null,
        }
    },
    onDone:function(){
        this.context.useItem(this.props.itemList);
        this.props.onDone();
    },
    render:function(){
        var itemList = this.props.itemList;
        var boxSaveData = this.context.boxSaveData;
        var bag = boxSaveData.bag.things;
        var haveItem = (this.context.checkHaveResourceAll(itemList));
        return (
                <BtnComponent disabled = {!haveItem}  handleClick = {this.onDone}>
                    <span>{this.props.giveDesc || '给' }&nbsp;</span>
                    <RequireComponent requireList = {itemList}/>
                </BtnComponent>
            )
    }
});
var TownEvent = React.createClass({
    contextTypes:{
        campSaveData        :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        eventSaveData       :React.PropTypes.object.isRequired,
        setEventExperienced :React.PropTypes.func.isRequired,
        skill               :React.PropTypes.object.isRequired,
    },
    getInitialState:function(){
        return {
            givingEquip:false,
        }
    },
    getDefaultProps:function(){
        return{
            town:null,
        }
    },
    handleJoin:function(){
        var town = this.props.town;
        this.context.useTime(function(){
            var campSaveData = this.context.campSaveData;
            campSaveData.choice = this.props.town;
            this.context.setStateFromChildren({campSaveData:campSaveData});

            //  敌人不可使用
            var oppo = (town == 'ice')?'fire':'ice';
            this.context.setEventExperienced(oppo + 'TownEvent');
            this.context.skill[town == 'ice'?'blood':'absorb'] = true;
            this.context.setStateFromChildren({menuHint:1},true);
        }.bind(this),4);
    },
    handleBack:function(){
        this.context.callWindow(null);
    },
    handleOK:function(){
        this.setState({givingEquip:true});
    },
    setPicked:function(){
        this.context.setEventExperienced('iceTownEvent');
        this.context.setEventExperienced('fireTownEvent');
    },
    render:function(){
        var campSaveData = this.context.campSaveData;
        var choice = campSaveData.choice;
        var town = this.props.town;
        var oppo = (town == 'ice')?'fire':'ice';
        var townDesc = PLACE_DATA[town].name;
        var oppoDesc = PLACE_DATA[oppo].name;

        if(this.state.givingEquip){
            var itemList = {
                        ice:{
                            healPotion:4,
                            psPotion:4,
                            iceBumb:20,
                        },
                        fire:{
                            smallSanPotion:4,
                            bighpPotion:2,
                            fireBumb:2,
                        }
                    }
            return(
                    <div>
                        <p>你现在可以随时去挑战{oppoDesc}。</p>
                        <RegisterComponent canBack = {false} canBeEmpty = {true} itemList = {itemList[town]}/>
                        <BtnBack callBack = {this.setPicked}/>
                    </div>
                )
        }

        if(!choice){
            return(
                    <div>
                        {
                            town == 'fire'?(
                                <div>
                                    <p>我们是由法师教徒组成的{townDesc}。</p>
                                    <p>自从我们踏上这片土地，就一直在努力清理各种恐怖生物。</p>
                                    <p>直到邪恶的{oppoDesc}进入我我们的视野。</p>
                                    <p>他们的力量十分强大，但是蠢得就像一袋子锤子！</p>
                                    <p>我们必须去消灭{oppoDesc}！我们不能让这些家伙的势力壮大起来。</p>
                                    <p>我们即将展开一场大战，你要加入我们吗？</p>
                                </div>
                            ):(
                                <div>
                                    <p>我们是蛮力的{townDesc}。</p>
                                    <p>最近一段时间，{oppoDesc}已经在南面占领了大片沙漠，并建立了一个营地。</p>
                                    <p>我怀疑他们是不是在谋划什么你想象不到的可怕事情。</p>
                                    <p>我们必须去消灭{oppoDesc}！我们不能让这些家伙的势力壮大起来。</p>
                                    <p>我们即将展开一场大战，你要加入我们吗？</p>
                                </div>
                            )
                        }
                        <p style = {{color:'#C2C788'}}>{townDesc}{town == 'ice'?<span>擅长格斗攻击，你能够习得‘嗜血’能力</span>:<span>擅长魔法攻击，你能够习得‘吸收’能力</span>}</p>
                        <BtnComponent handleClick = {this.handleJoin}>加入<span style = {{color:COLOR.BLUE}}>{townDesc}</span></BtnComponent>
                        <BtnBack/>
                    </div>
                )
        }else{
            return(
                    <div>
                        <p>你获得了技能<span style = {{color:COLOR.BLUE}}>[{town == 'ice'?'嗜血':'吸收'}]</span>。</p>
                        <p>现在我将授予你战争的给养。</p>
                        <div><BtnComponent handleClick = {this.handleOK}>我准备好了</BtnComponent></div>
                        <div><BtnComponent handleClick = {this.handleBack}>容我休整下</BtnComponent></div>
                    </div>
                )
        }
    }
});
var ThiefEvent = React.createClass({
    contextTypes:{
        campSaveData        :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        eventSaveData       :React.PropTypes.object.isRequired,
        setEventExperienced :React.PropTypes.func.isRequired,
        skill               :React.PropTypes.object.isRequired,
    },
    getInitialState:function(){
        return {
            give:false,
            battle:false,
            killingRobber:false,
        }
    },
    handleGive:function(){
        this.context.setEventExperienced('thief_2');
        var wind = <div>
                        <p>--覆面忍者--</p>
                        <p>感激不尽，兄弟！我给你一个我的最得意的装备作为谢礼..</p>
                        <RegisterComponent itemList = {{ninjaJacket:1}} canBack = {false} canBeEmpty = {true} />
                        <BtnBack/>
                    </div>
        this.context.callWindow(wind);
    },
    handleKill:function(){
        this.context.setEventExperienced('thief_2');
        var wind = <div>
                    <p>--覆面忍者--</p>
                    <p>这是你自找的...</p>
                    <BtnComponent handleClick = {this.handleBattle}>决斗！</BtnComponent>
                </div>
        this.context.callWindow(wind);
    },
    handleKillRobber:function(){
        this.setState({killingRobber:true});
    },
    handleBattle:function(){
        var wind = <div>
                    <BattleComponent mst = 'thief'/>
                </div>
        this.context.callWindow(wind);
    },
    render:function(){
        var self = this;
        if(this.state.killingRobber){
            return <div>
                        <BattleComponent winScene = {(
                            <div>
                                <p>--覆面忍者--</p>
                                <p>嗨，多亏你的帮助，我拿到了这个宝物。</p>
                                <p>它散发着金色的光辉，肯定是古董错不了！</p>
                                <BtnComponent handleClick = {self.handleGive}>把财宝分给穷人吧....</BtnComponent>
                                <BtnComponent handleClick = {self.handleKill}>这是我的！休想离开！</BtnComponent>
                            </div>
                        )} mst = 'robberHead'/>
                    </div>
        }
        return <div>
                    <p>--覆面忍者--</p>
                    <p>他也发现了我们！</p>
                    <BtnComponent handleClick = {this.handleKillRobber} >战斗！</BtnComponent>
                    <BtnBack/>
                </div>
    }
});
var Reincarnation = React.createClass({
    contextTypes:{
        skill               :React.PropTypes.object.isRequired,
        reBorn              :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        checkHaveResourceAll :React.PropTypes.func.isRequired,
    },
    getInitialState:function(){
        return {
        }
    },
    getCost:function(attr,tmp){
        //传入技能名以及技能对象计算升级所需的消耗
        var amount = this.context.skill[attr] || 0;
        return tmp.cost + tmp.costInc * amount;
    },
    handleDone:function(attr){
        this.context.reBorn(attr);
    },
    getChoiceDisplay:function(){
        var result = [];
        for(var attr in SKILL_DATA){
            var tmp = SKILL_DATA[attr];
            if(!tmp.isTalent)continue;
            var requireList = o('blood',this.getCost(attr,tmp));
            result.push(
                <tr key = {attr}>
                    <td>{tmp.name}</td>
                    <td>{tmp.desc}</td>
                    <td><RequireComponent requireList = {requireList}/></td>
                    <td><BtnComponent desc = '转生' disabled = {!this.context.checkHaveResourceAll(requireList,'bag')} handleClick = {this.handleDone.bind(null,attr)}/></td>
                </tr>
                )
        }
        return result;
    },
    render:function(){
        return  <div>
                    <p>--转生--</p>
                    <p>选择转生，你将失去当前(90%)的(非天赋)技能以及物品。</p>
                    <p>从以下天赋中选择一项进行转生。</p>
                    <div style = {{margin:'auto',fontSize:10,maxHeight:300,width:'80%',overflow:'auto'}}>
                        <table className="table table-condensed table-hover table-striped table-bordered">
                            <tbody>
                                {this.getChoiceDisplay()}
                            </tbody>
                        </table>
                    </div>
                    <BtnBack/>
                </div>
    }
});
var BossComponent = React.createClass({
    contextTypes:{
        eventSaveData       :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        maouLevel           :React.PropTypes.number.isRequired,
    },
    getInitialState:function(){
        return {
            giving:false,
            battling:false,
        }
    },
    onGive:function(){
        this.setState({giving:true});
    },
    onBattle:function(){
        this.setState({battling:true});
    },
    onWin:function(){
        this.context.setStateFromChildren({maouLevel:this.context.maouLevel + 1});
    },
    render:function(){
        var maouLevel = this.context.maouLevel;
        if(this.state.battling){
            var mstState = {
                maxHp:10000,
                hpMul:500 * (0.2 * maouLevel + 1) * maouLevel,
                dmg:5000 * (0.2 * maouLevel + 1) * maouLevel + 10000,
            }
            return <BattleComponent mstState = {mstState}  mst = 'maou' onWin = {this.setDone} winScene = {(
                                <div>
                                    <p>--邪恶大魔王--</p>
                                    <p>我会回来哒！！！</p>
                                    <RegisterComponent itemList = {{blood:1}} canBeEmpty = {true} canBack = {false}/>
                                    <BtnBack callBack = {this.onWin}/>
                                </div>
                            )}/>;
        }else{
            var showLevel = maouLevel>0?(<span style = {{color:COLOR.BLUE}}>[轮回:{maouLevel}]</span>):null;
            if(this.state.giving){
                return (
                    <div>
                        <p>邪恶大魔王{showLevel}出现了！</p>
                        <BtnComponent desc = '战斗！' handleClick = {this.onBattle}/>
                    </div>
                    )
            }else{
                return <div>
                    <p>--邪恶的封印阵{showLevel}--</p>
                    <p>你需要一些魂晶石才能打破魔王的封印。。。</p>
                    <GiveComponent itemList = {{reiPart:10 + 2 * maouLevel}} onDone = {this.onGive}/>
                    <BtnBack/>
                </div>
            }
        }
    }
});
var EventComponent = React.createClass({
    contextTypes:{
        eventSaveData       :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
    },
    childContextTypes:{
        setEventExperienced:React.PropTypes.func.isRequired,
    },
    getChildContext:function(){
        return{
            setEventExperienced:this.setEventExperienced
        }
    },
    getDefaultProps:function(){
        return{
            type:null
        }
    },
    setEventExperienced:function(eventName){
        var eventSaveData = this.context.eventSaveData;
        if(eventSaveData[eventName] == undefined){
            eventSaveData[eventName] = {};
        }
        eventSaveData[eventName].experienced = true;
        this.context.setStateFromChildren({eventSaveData:eventSaveData});
    },
    componentWillMount:function () {
        this.eventMap = {
            tramp: <TrampComponent/>,
        }
        this.eventMap.boss = <BossComponent/>;
        this.eventMap.reincarnation = <Reincarnation/>;
        this.eventMap.miner =   (
                                <div>
                                    <p>-采矿小分队-</p>
                                    <p>我们的矿洞有大量的矿石资源。</p>
                                    <p>你也要加入我们吗？</p>
                                    <p>--------</p>
                                    <p>采矿小分队标出了<span style = {{color:COLOR.GREEN}}>[矿洞]</span>的位置。</p>
                                    <RegisterComponent canBeEmpty = {true} itemList = {{pickaxe:1}} canBack = {false}/>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'miner')} />
                                </div>
                            );
        this.eventMap.trade =   (
                                <div>
                                    <p>-商队-</p>
                                    <p>你好，我们正准备在这个偏僻的小镇设置集市。</p>
                                    <p>希望能方便大家交换物品。</p>
                                    <p>商队标出了<span style = {{color:COLOR.RED}}>[集市]</span>的位置。</p>
                                    <RegisterComponent canBeEmpty = {true} itemList = {{security:2}} canBack = {false}/>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'trade')} />
                                </div>
                            );
        this.eventMap.giveScroll =   (
                                <div>
                                    <p>-神秘旅者-</p>
                                    <p>你好勇士，前方就是地牢了。</p>
                                    <p>地牢坑爹的设定是,你不能随时回去。</p>
                                    <p>别担心，我送你一个回城卷轴，祝你玩的愉快...</p>
                                    <RegisterComponent canBeEmpty = {true} itemList = {{scroll:1}} canBack = {false} />
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'giveScroll')} />
                                </div>
                            );
        this.eventMap.santa =    (
                                <div>
                                    <p>-麋鹿-</p>
                                    <p>嗨，圣诞快乐！</p>
                                    <p>拿好你的礼物不要掉了！</p>
                                    <RegisterComponent canBeEmpty = {true} itemList = {SANTA_GIFT} canBack = {false}/>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'santa')}/>
                                </div>
                            );

        this.eventMap.huntIntro =    (
                                <div>
                                    <p>-年迈的猎人-</p>
                                    <p>这里一很多小兔子，但要小心那些老鹰。</p>
                                    <p>对付它们最好带上一把猎枪。</p>
                                    <p>这些是我今天的猎物，很乐意与你分享：</p>
                                    <RegisterComponent canBeEmpty = {true} itemList = {{meat:1}} canBack = {false}/>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'huntIntro')}/>
                                </div>
                            );
        this.eventMap.robberQuestGet = (
                                <div>
                                    <p>-村长-</p>
                                    <p>几个星期前，一个离开家去远处采草药，被盗贼袭击了</p>
                                    <p>小镇因此被整得人心惶惶。</p>
                                    <p>你能帮我去贼窝解决掉一些贼吗？</p>
                                    <p>贼窝有很多赃物，如果你能整治盗贼，那些当然都归你了。</p>
                                    <p>--------</p>
                                    <p>村长标记出<span style = {{color:COLOR.GREEN}}>[贼窝]</span>的位置。</p>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'robberQuestGet')}/>
                                </div>
                            );
        this.eventMap.robberQuest = <QuestComponent event = 'robberQuest'/>;
        this.eventMap.spiderQuestGet = (
                                <div>
                                    <p>-村长-</p>
                                    <p>村子的侦察兵报告说周边地区充斥着可怕的蜘蛛，并且已经建立了自己的巢穴。</p>
                                    <p>你能帮我去蜘蛛巢穴解决掉蛛魔的首领吗？</p>
                                    <p>--------</p>
                                    <p>村长标记出<span style = {{color:COLOR.GREEN}}>[蜘蛛巢穴]</span>的位置。</p>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'spiderQuestGet')}/>
                                </div>
                            );
        this.eventMap.spiderQuest = <QuestComponent event = 'spiderQuest'/>;
        this.eventMap.dragonQuestGet = (
                                <div>
                                    <p>-村长-</p>
                                    <p>我们接到越来越多的报告，邪恶的龙群正在滋扰附近的地区。</p>
                                    <p>我给那些畜牲挂了悬赏。但我相信，只有你能阻止它们。</p>
                                    <p>--------</p>
                                    <p>村长标记出<span style = {{color:COLOR.GREEN}}>[龙之峡谷]</span>的位置。</p>
                                    <BtnBack callBack = {this.setEventExperienced.bind(this,'dragonQuestGet')}/>
                                </div>
                            );
        this.eventMap.dragonQuest = <QuestComponent event = 'dragonQuest'/>;

        this.eventMap.graveEvent     = <QuestComponent event = 'graveEvent' />;



        this.eventMap.misteryQuest_1 = <QuestComponent event = 'misteryQuest_1'/>;
        this.eventMap.misteryQuest_2 = <QuestComponent event = 'misteryQuest_2'/>;
        this.eventMap.misteryQuest_3 = <QuestComponent event = 'misteryQuest_3'/>;

        this.eventMap.drinker_1      = <QuestComponent event = 'drinker_1'/>;
        this.eventMap.drinker_2      = <QuestComponent event = 'drinker_2'/>;
        this.eventMap.drinker_3      = <QuestComponent event = 'drinker_3'/>;
        this.eventMap.drinker_4      = <QuestComponent event = 'drinker_4'/>;
        this.eventMap.drinker_end    = <QuestComponent event = 'drinker_end' forever = 'true'/>;

        this.eventMap.farmer_1       = <QuestComponent event = 'farmer_1'/>;
        this.eventMap.farmer_2       = <QuestComponent event = 'farmer_2'/>;
        this.eventMap.farmer_3       = <QuestComponent event = 'farmer_3'/>;
        this.eventMap.farmer_end       = <QuestComponent event = 'farmer_end'  forever = 'true'/>;

        this.eventMap.minerFood      = <QuestComponent event = 'minerFood' forever = 'true'/>;

        this.eventMap.goblin        = <QuestComponent event = 'goblin'/>;
        this.eventMap.goblin_1      = <QuestComponent event = 'goblin_1'/>;
        this.eventMap.goblin_2      = <QuestComponent event = 'goblin_2'/>;
        this.eventMap.goblin_3      = <QuestComponent event = 'goblin_3'/>;
        this.eventMap.goblin_4      = <QuestComponent event = 'goblin_4'/>;
        this.eventMap.goblin_5      = <QuestComponent event = 'goblin_5'/>;
        this.eventMap.goblin_end    = <QuestComponent event = 'goblin_end' forever = 'true'/>;

        this.eventMap.iceTownEvent = <TownEvent town = 'ice'/>
        this.eventMap.fireTownEvent = <TownEvent town = 'fire'/>

        this.eventMap.thief      = <QuestComponent event = 'thief'/>;
        this.eventMap.thief_1      = <QuestComponent event = 'thief_1'/>;
        this.eventMap.thief_2      = <ThiefEvent/>;

        this.eventMap.map_1      = <QuestComponent event = 'map_1'/>;
        this.eventMap.map_2      = <QuestComponent event = 'map_2'/>;
        this.eventMap.map_3      = <QuestComponent event = 'map_3'/>;
        this.eventMap.map_4      = <QuestComponent event = 'map_4'/>;

        this.eventMap.iceTownEvent_1      = <QuestComponent event = 'iceTownEvent_1'/>;
        this.eventMap.iceTownEvent_2      = <QuestComponent event = 'iceTownEvent_2'/>;
        this.eventMap.iceTownEvent_3      = <QuestComponent event = 'iceTownEvent_3'/>;
        this.eventMap.iceTownEvent_end      = <QuestComponent event = 'iceTownEvent_end' forever = 'true'/>;

        this.eventMap.fireTownEvent_1      = <QuestComponent event = 'fireTownEvent_1'/>;
        this.eventMap.fireTownEvent_2      = <QuestComponent event = 'fireTownEvent_2'/>;
        this.eventMap.fireTownEvent_3      = <QuestComponent event = 'fireTownEvent_3'/>;
        this.eventMap.fireTownEvent_end      = <QuestComponent event = 'fireTownEvent_end' forever = 'true'/>;

        this.eventMap.police_1      = <QuestComponent event = 'police_1'/>;
        this.eventMap.traces_1      = <QuestComponent event = 'traces_1'/>;
        this.eventMap.traces_2      = <QuestComponent event = 'traces_2'/>;
        this.eventMap.traces_3      = <QuestComponent event = 'traces_3'/>;
        this.eventMap.part_1      = <QuestComponent event = 'part_1'/>;
        this.eventMap.part_2      = <QuestComponent event = 'part_2'/>;
        this.eventMap.denBox      = <QuestComponent event = 'denBox'/>;

        this.eventMap.gulf = <QuestComponent event = 'gulf'/>;
    },
    render:function(){
        var type = this.props.type;
        var data = EVENT_DATA[type];
        return <div>{this.eventMap[type]}</div>;
    }
});
var TradeComponent = React.createClass({
    preBagThings:null,
    contextTypes:{
        getScienceLevel     :React.PropTypes.func.isRequired,
        tradeSaveData       :React.PropTypes.array.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        setDueling          :React.PropTypes.func.isRequired,
        getValue            :React.PropTypes.func.isRequired,
        AudioEngine         :React.PropTypes.object.isRequired,
        skill               :React.PropTypes.object.isRequired,
    },
    getDefaultProps:function(){
        return {
            trade:null,
            tradeData:null,
            index:null,
            canBack:true,
        }
    },
    getInitialState:function(){
        return{
            isOver:false,
        }
    },
    getTradingState:function(){
        var skill = this.context.skill;
        var sellerLevel = (skill.seller || 0) * SKILL_DATA.seller.buff;

        var beaconMax = this.context.getScienceLevel('beaconMax');

        var trade = this.props.trade;
        var detail = TRADE_DATA[trade];
        var max = Math.round((detail.max || 100)*(0.5 * beaconMax + 1)*(1 + sellerLevel));
        var give = detail.give;
        var value = this.context.getValue(give);
        var playerGive = this.context.boxSaveData.register.things;
        var playerValue = 0;
        for(var attr in playerGive){
            playerValue += this.context.getValue(attr) * playerGive[attr];
        }
        playerValue *= TRADE_MUL;
        var amount = Math.floor(playerValue/value);
        var overFlow = false;
        if (amount > max){
            overFlow = true;
            amount = max;
        }
        var isNothing = false;
        if(getLength(playerGive) == 0)isNothing = true;
        return {
            give:give,
            max:max,
            isNothing:isNothing,
            amount:amount,
            overFlow:overFlow,
            traderName:detail.name,
            giveName:ITEM_DATA[give].name
        };
    },
    getDialog:function(){
        var result = [];
        var state = this.getTradingState();
        function wrap(input){
            return <span style = {{color:COLOR.BLUE}}>[{input}]</span>
        }
        result.push(<p key = 'header'>-{state.traderName}-</p>);
        if(!state.isNothing){
            if(state.amount == 0){
                result.push(state.max == 1?(
                    <p key = '1'>这不够，再多给点。</p>):(
                    <p key = '1'>拜托...再多给一点...</p>)
                );
            }else{
                result.push(state.max == 1?(
                    <p key = '1'>好吧，那么。。成交？</p>):(
                    <p key = '1'>我可以给你({(state.amount)})个{wrap(state.giveName)}...</p>)
                );
            }
        }else{
            result.push(state.max == 1?(
                <p key = '0'>这本{wrap(state.giveName)}凝聚了我的真传，你得给我很多东西来换它。</p>):(
                <p key = '0'>我给你带来了一些{wrap(state.giveName)}，感兴趣吗？</p>)
                );
            result.push(<p key = 'hint' style = {{'color':'#ccc'}}>/按住ctrl(10倍) shift(100倍)进行批量交易/</p>)
        }
        if(state.overFlow){
            result.push(<p key = '2'>我没有更多的{wrap(state.giveName)}了，伙计。</p>);
        }
        return result;
    },
    componentWillMount:function(){
        var boxSaveData = this.context.boxSaveData;
        this.preBagThings = clone(boxSaveData.bag.things);
        boxSaveData.register.things = {};
        this.context.setStateFromChildren({boxSaveData:boxSaveData});
        this.context.setDueling(true);
        this.context.AudioEngine.playEffect('bell');
    },
    componentWillUnmount:function(){
        this.context.setDueling(false);
    },
    duel:function(){
        this.context.setDueling(false);
        //成交
        var state = this.getTradingState();
        var give = state.give;
        var amount = state.amount;
        var o = {};
        if(amount>0)o[give] = amount;
        var boxSaveData = this.context.boxSaveData;
        boxSaveData.register.things = o;
        this.context.setStateFromChildren({boxSaveData:boxSaveData});
        if(TRADE_DATA[this.props.trade].type != 'dungeon'){
            this.context.tradeSaveData.splice(this.props.index,1);
        }
        this.setState({isOver:true});
    },
    refuse:function(){
        var boxSaveData = this.context.boxSaveData;
        // boxSaveData.bag.things = clone(this.preBagThings);
        // boxSaveData.register.things = {};

        for(var attr in boxSaveData.register.things){
            boxSaveData.bag.things[attr] = (boxSaveData.bag.things[attr] || 0) + boxSaveData.register.things[attr];
            delete boxSaveData.register.things[attr];
        }
        this.context.setStateFromChildren({boxSaveData:boxSaveData});

    },
    render:function(){
        var currenState = this.getTradingState(); 
        if(this.state.robbing){
            return  (
                        <BattleComponent mst = {this.props.trade}/>
                    );
        }

        if(this.state.isOver){
            return  (
                        <div>
                            <p>{TRADE_DATA[this.props.trade].name}扬长而去...</p>
                            <RegisterComponent canBack = {this.props.canBack} itemList = {o}/>
                        </div>
                    );
        }
        return  <div>
                    {this.getDialog()}
                    <RegisterComponent canBeEmpty = {true} canPick = {false} canBack = {false} />
                    {this.props.canBack?<BtnBack disabled = {getLength(this.context.boxSaveData.register.things) != 0}/>:null}
                    <BtnComponent disabled = {getLength(this.context.boxSaveData.register.things) == 0} desc = '撤回' handleClick = {this.refuse}/>
                    <BtnComponent disabled = {!this.getTradingState().amount>0} desc = '成交' handleClick = {this.duel}/>
                </div>
    }
});
var TradeListComponent = React.createClass({
    contextTypes:{
        tradeSaveData:React.PropTypes.array.isRequired,
        callWindow:React.PropTypes.func.isRequired,
    },
    handleClick:function(index){
        var tradeName = this.context.tradeSaveData[index].trade;
        this.context.callWindow(<TradeComponent index = {index} trade = {tradeName}/>);
    },
    getTradeRow:function(){
        var tradeSaveData = this.context.tradeSaveData;
        var result = [];
        for (var i = tradeSaveData.length - 1; i >= 0; i--) {
            var tmp = tradeSaveData[i];
            if(!TRADE_DATA[tmp.trade])continue;
            result.push(<tr key = {'trade_' + i}>
                            <td>{TRADE_DATA[tmp.trade].name}</td>
                            <td><BtnComponent handleClick = {this.handleClick.bind(this,i)} desc = '交易'/></td>
                        </tr>)
        };
        if(tradeSaveData.length == 0){
            return <tr><td colSpan = {2}>一个人也没有...</td></tr>
        }
        return result;
    },
    render:function(){
        return  <div className = "oppo">
                    <table className="table table-condensed table-hover table-striped table-bordered">
                    <thead><tr><td colSpan = "2">集市</td></tr></thead>
                    <tbody>
                    {this.getTradeRow()}
                    </tbody>
                    </table>
                </div>
    }
})
var MsgBox = React.createClass({
    contextTypes:{
        msgList:React.PropTypes.array.isRequired,
        showMsg:React.PropTypes.func.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
    },
    componentWillMount:function(){
    },
    componentWillUnmount:function(){
        this.context.setStateFromChildren({msgList:[]});
    },
    render: function() {
        var msgList = this.context.msgList;
        var list = [];
        for (var i = msgList.length - 1; i >= 0; i--) {
            list[msgList.length - i] = msgList[i];
        };
        return (
        <div className='msgShow'>
            <ReactCSSTransitionGroup transitionEnterTimeout = {200} transitionLeaveTimeout = {1000} transitionName = "msg" className = "msg">
                {list}
            </ReactCSSTransitionGroup>
        </div>
        );
    }
});
//all the building at home
//家内建筑
var BigBoxComponent = React.createClass({
    contextTypes:{
        boxSaveData         : React.PropTypes.object.isRequired,
        getBuildingLevel    : React.PropTypes.func.isRequired,
        setStateFromChildren: React.PropTypes.func.isRequired,
        handleExchange      : React.PropTypes.func.isRequired,
        cancelEquip         : React.PropTypes.func.isRequired,
        sort                : React.PropTypes.func.isRequired,
    },
    getDefaultProps:function(){
        return {
        };
    },
    onUpdate:function(){
        var level = this.context.getBuildingLevel('bigBoxUpdate');
        var boxSaveData = this.context.boxSaveData;
        boxSaveData['bigBox'].size = BIG_BOX_BASE_SIZE + level*4;
        this.context.setStateFromChildren({boxSaveData:boxSaveData});
    },
    allIn:function(){
        var cancelEquip = this.context.cancelEquip;
        function exchange(name){
            cancelEquip(name);
            if(bigBox.things[name]){
                bigBox.things[name] += bag.things[name];
            }else{
                bigBox.things[name] = bag.things[name];
            }
            delete bag.things[name];
        }
        var boxSaveData = clone(this.context.boxSaveData);
        var bigBox = boxSaveData.bigBox;
        var bag = boxSaveData.bag;
        var handleExchange = this.context.handleExchange;

        while(1){
            if(bigBox.size < getLength(bigBox.things))break;
            if(bigBox.size == getLength(bigBox.things)){
                for(var bagAttr in bag.things){
                    for(var bigBoxAttr in bigBox.things){
                        if(bagAttr == bigBoxAttr){
                            exchange(bagAttr);
                        }
                    }
                }
                break;
            }else{
                if(getLength(bag.things) == 0)break;
                for(var attr in bag.things){
                    exchange(attr);
                    break;
                }
            }
        }
        this.context.setStateFromChildren({boxSaveData:boxSaveData})
    },
    checkDisabled:function(){
        var boxSaveData = (this.context.boxSaveData);
        if(boxSaveData.bigBox.size <= getLength(boxSaveData.bigBox.things)){
            var flag = true;
            //有相同物品，则允许合并，全部放入、
            for(var attr in boxSaveData.bigBox.things){
                for(var attr_2 in boxSaveData.bag.things){
                    if(attr == attr_2){
                        flag = false;
                    }
                }
            }
            return flag;
        }
        if(getLength(boxSaveData.bag.things) <= 0)return true;
        return false;
    },
    render:function() {
        var disabled = this.checkDisabled();
        return  <div className = 'bigBoxOuter'>
                    <div className = 'bigBox'>
                        <BoxComponent box = 'bigBox'/>
                    </div>
                    <StudioComponent onUpdate = {this.onUpdate} isBuildingUpdate = {true} type = 'bigBoxUpdate'/>
                    <BtnComponent disabled = {disabled} sound = 'all_in' handleClick = {this.allIn} desc = '全部放入'/>
                    <BtnComponent  sound = 'all_in' handleClick = {this.context.sort.bind(null,'bigBox')} desc = '整理'/>
                    <BtnBack/>
                </div>
    }
});
var BuildComponent = React.createClass({
    contextTypes:{
        buildingSaveData:React.PropTypes.object.isRequired,
        boxSaveData     :React.PropTypes.object.isRequired,
        useTime         :React.PropTypes.func.isRequired,
        useItemThatPlayerHave         :React.PropTypes.func.isRequired,
        callWindow      :React.PropTypes.func.isRequired,
        AudioEngine     :React.PropTypes.object.isRequired,
        getTheMaxTimeToUse:React.PropTypes.func.isRequired,
    },
    build:function(buildingName){
        var timeNeed = BUILDING_DATA[buildingName].timeNeed;
        var require = BUILDING_DATA[buildingName].require;
        this.context.useItemThatPlayerHave(require);
        function callBack(){
            this.context.buildingSaveData[buildingName].own = true;
            this.context.callWindow(null);
        }
        this.context.useTime(callBack.bind(this),timeNeed);
        if(timeNeed > 2)this.context.AudioEngine.playEffect('build');
    },
    getOwnAndUnOwnNumber:function(list){
        var countOwn = 0;
        var countUnOwn = 0;
        for (var attr in list) {
            if(list[attr].own){
                countOwn++;
            }else{
                countUnOwn++;
            }
        };
        return {countOwn:countOwn,countUnOwn:countUnOwn};
    },
    render:function(){
        var buildingList = this.context.buildingSaveData;
        if(this.getOwnAndUnOwnNumber(buildingList).countUnOwn==0){
            return  <div>
                        <p>你已经拥有了所有的建筑。</p>
                        <BtnBack/>
                    </div>
            ;
        }
        var getRow = function(){
            var result = [],count = 0;
            for (var attr in buildingList) {
                var building = buildingList[attr];
                var data = BUILDING_DATA[attr];

                var boxSaveData = this.context.boxSaveData;

                if(data.science && !boxSaveData.scienceTable.things[data.science])continue;
                if(data.building && !buildingList[data.building].own)continue;

                var maxTimeToUse = this.context.getTheMaxTimeToUse();
                if(building.own)continue;
                result.push(<tr key = {count}>
                                <td>{data.name}</td>
                                <td><RequireComponent haveBox = {true} requireList = {data.require}/></td>
                                <td>{data.desc}</td>
                                <td>{data.timeNeed}</td>
                                <td><BtnComponent desc = {'建造'} disabled = {maxTimeToUse <= data.timeNeed} requireList = {data.require} handleClick = {this.build.bind(this,attr)}/></td>
                            </tr>);
                count ++;

            };
            return result
        }
        return  <div>
                    <div  className = "tableOuter buildTable">
                        <table className = "table table-condensed table-hover">
                            <thead><tr><td>建筑</td><td>需求</td><td>描述</td><td>耗时</td><td></td></tr></thead>
                            <tbody>
                                {getRow.bind(this)()}
                            </tbody>
                        </table>
                    </div>
                    <BtnBack/>
                </div>
    }
})
var WaitMakeComponent = React.createClass({
    contextTypes:{
        buildingSaveData    : React.PropTypes.object.isRequired,
        boxSaveData         : React.PropTypes.object.isRequired,
        setStateFromChildren: React.PropTypes.func.isRequired,
        checkHaveResourceAll: React.PropTypes.func.isRequired,
        useTime             : React.PropTypes.func.isRequired,
        useItemThatPlayerHave             : React.PropTypes.func.isRequired,
        checkFull           : React.PropTypes.func.isRequired,
        changeItem          : React.PropTypes.func.isRequired,
        getScienceLevel     : React.PropTypes.func.isRequired,
        season              : React.PropTypes.string.isRequired,
        skill               : React.PropTypes.object.isRequired,
    },
    componentWillMount:function(){
        var level = this.context.getScienceLevel(this.props.building + 'SizeBonus');
        var buildingSaveData = this.context.buildingSaveData;
        buildingSaveData[this.props.building].size = 2 + level;
    },
    getInitialState:function(){
        return {
        }
    },
    getDefaultProps:function(){
        return{
            building:'farm',
            attachData:CROP_DATA,
        }
    },
    farm:function(cropType){
        var attachData = this.props.attachData;
        var building = this.props.building;
        var timeNeed = attachData[cropType].timeNeed;
        var require = attachData[cropType].require;
        function callBack(){
            this.context.useItemThatPlayerHave(require);
            this.context.buildingSaveData[building].list.push({type:cropType,timeMax:attachData[cropType].timeMax,timeNow:0});
        }
        this.context.useTime(callBack.bind(this),timeNeed);
    },
    harvest:function(index){
        var attachData = this.props.attachData;
        var buildingSaveData = this.context.buildingSaveData;
        var building = this.props.building;
        var tar = attachData[this.context.buildingSaveData[building].list[index].type];
        var itemGet = tar.itemGet;
        var itemAmount = tar.itemAmount;
        var o = {};
        o[itemGet] = this.getAmount(itemAmount);
        if(!this.context.checkFull('bag',itemGet)){
            this.context.changeItem(o,'bag');
            var savedata = this.context.buildingSaveData;
            savedata[building].list.splice(index,1);
            //取消提示
            buildingSaveData[building].hint = false;
            this.context.setStateFromChildren({buildingSaveData:savedata});
        }
    },
    getAmount:function(amount){
        var skill = this.context.skill;
        var result = amount;
        if(skill.farm && this.props.building == 'farm'){
            result *= 1 + skill.farm * SKILL_DATA.farm.buff;
            result = Math.round(result);
        }
        if(skill.alco && this.props.building == 'alco'){
            result *= 1 + skill.alco * SKILL_DATA.alco.buff;
            result = Math.round(result);
        }
        return result;
    },
    render:function(){
        var attachData = this.props.attachData;
        var building = this.props.building;
        var season = this.context.season;
        var crop = this.context.buildingSaveData[building];

        var skill = this.context.skill;
        var manageLevel = (skill.manage || 0) * SKILL_DATA.manage.buff;
        function getListDisplay(){
            var result = [];
            var cropList = crop.list;
            var size = crop.size;
            for (var i = 0; i < cropList.length; i ++) {
                var tmp = cropList[i];
                var max = tmp.timeMax/(1 + manageLevel);//经营手腕
                var current = tmp.timeNow;
                if(max<=current){
                    var btn = <BtnComponent desc = '收获' handleClick = {this.harvest.bind(null,i)}/>;
                    result.push(<VectorComponent key = {i} msg_top = {attachData[tmp.type].desc} msg_top_color = {COLOR.BLUE} btn_bottom = {btn}/>)
                }else{
                    var bar = <ProgressComponent max = {max}  current = {current}/>
                    result.push(<VectorComponent key = {i} msg_top = {attachData[tmp.type].desc} msg_bottom = {bar} msg_top_color = {COLOR.BLUE} />)
                }
            };
            for (var i = cropList.length; i < size; i++) {
                result.push(<VectorComponent key = {i}/>);
            };
            return result;
        }
        function getCropTypeDesc(){
            var list = attachData;
            var result = [];
            var count = 0;
            for (var attr in  list) {
                var tmp = list[attr];

                var crop = this.context.buildingSaveData[building];
                var isFull = crop.size <= crop.list.length;
                result.push(<tr key = {count}>
                                <td style={{color:COLOR.BLUE}}>{grtDesc.bind(this)() + tmp.desc}</td>
                                <td><RequireComponent haveBox = {true} requireList = {tmp.require} /></td>
                                <td>{tmp.timeMax/(1 + manageLevel)}</td>
                                <td><RequireComponent isGreen = {true} requireList = {o(tmp.itemGet,this.getAmount(tmp.itemAmount))}/></td>
                                <td><BtnComponent style = {{margin:'0px'}} requireList = {tmp.require} disabled = {isFull} handleClick = {this.farm.bind(this,attr)} desc = "设置" /></td>
                            </tr>);

                count ++;
            };
            return result;
        }
        function grtDesc(){
            var map = {
                farm:'农作物',
                alco:'酿制',
            }
            return map[this.props.building]
        }
        function grtDesc_2(){
            var map = {
                farm:<p>种植农作物需要大量肥料。</p>,
                alco:<p>酿造酒需要大量水。</p>,
            }
            return map[this.props.building]
        }
        function getTheadDesc(){
            var map = {
                farm:<tr><td>类型</td><td>需求</td><td>培育周期</td><td>收益</td><td></td></tr>,
                alco:<tr><td>类型</td><td>需求</td><td>酿造周期</td><td>获得</td><td></td></tr>
            }
            return map[this.props.building]
        }
        function seasonDesc(){
            var map = {
                farm:{
                    'spring':<p>在春天，农作物的生长速度是平时的两倍。</p>,
                    'winter':<p>在冬天，所有农作物将停止生长。</p>,
                },
                alco:{
                    'winter':<p>啤酒桶结冰了，无法发酵</p>,
                },
            }
            return map[building][season] || null;
        }
        return  <div>
                    {seasonDesc.bind(this)()}
                    {grtDesc_2.bind(this)()}
                    <div className = "crop">
                        {getListDisplay.bind(this)()}
                        <BtnBack/>
                    </div>
                    <div className = "tableOuter cropTableOuter">
                        <table className="table table-condensed table-hover">
                            <thead>{getTheadDesc.bind(this)()}</thead>
                            <tbody>
                                {getCropTypeDesc.bind(this)()}
                            </tbody>
                        </table>
                    </div>
                </div>

    }
})
var TrapComponent = React.createClass({
    desc:'诱饵',
    timeNeed:1,
    contextTypes:{
        boxSaveData         : React.PropTypes.object.isRequired,
        buildingSaveData    : React.PropTypes.object.isRequired,
        checkHaveResourceAll: React.PropTypes.func.isRequired,
        useItemThatPlayerHave: React.PropTypes.func.isRequired,
        useTime             : React.PropTypes.func.isRequired,
        getScienceLevel     : React.PropTypes.func.isRequired,
        checkFull           : React.PropTypes.func.isRequired,
        changeItem          : React.PropTypes.func.isRequired,
        setStateFromChildren: React.PropTypes.func.isRequired,
        AudioEngine         : React.PropTypes.object.isRequired,
    },
    componentWillMount:function(){
        var level = this.context.getScienceLevel('trapSizeBonus');
        var buildingSaveData = this.context.buildingSaveData;
        buildingSaveData['trap'].size = 2 + level;
    },
    getInitialState:function(){
        return {
            size:null
        }
    },
    makeTrap:function(trapType){
        var require = TRAP_DATA[trapType].require;
        this.context.useTime(
                (function(){
                    this.context.buildingSaveData.trap.list.push({type:trapType,succeed:false});
                    this.context.useItemThatPlayerHave(require);
                }).bind(this),
                this.timeNeed
            )
    },
    harvest:function(index){
        var tmp = this.context.buildingSaveData.trap.list[index];
        var itemGet = tmp.itemGet;
        var itemAmount = this.getAmount(tmp.itemAmount);
        if(!this.context.checkFull('bag',itemGet)){
            this.context.changeItem(o(itemGet,itemAmount),'bag');
            var buildingSaveData = this.context.buildingSaveData;
            buildingSaveData.trap.list.splice(index,1);
            buildingSaveData['trap'].hint = false;
            this.context.setStateFromChildren({buildingSaveData:buildingSaveData});
        }
    },
    getAmount:function(itemAmount){
        var level = this.context.getScienceLevel('trapGet');
        return Math.round(itemAmount * (1 + 0.5 * level));
    },
    distroyTrap:function(index){
        var buildingSaveData = this.context.buildingSaveData;
        var list = buildingSaveData.trap.list;
        list.splice(index,1);
        this.context.AudioEngine.playEffect('pick');
        this.context.setStateFromChildren({buildingSaveData:buildingSaveData});
    },
    render:function(){
        var trap = this.context.buildingSaveData.trap;
        function getListDisplay(){
            var result = [];
            var list = trap.list;
            var size = trap.size;
            for (var i = 0; i < list.length; i ++) {
                var tmp = list[i];
                if(tmp.succeed){
                    var btn = <BtnComponent desc = '收获' handleClick = {this.harvest.bind(null,i)}/>;
                    result.push(<VectorComponent key = {i} msg_top = {ITEM_DATA[this.context.buildingSaveData.trap.list[i].itemGet].name} msg_top_color = {COLOR.BLUE} btn_bottom = {btn}/>)
                }else{
                    result.push(<VectorComponent onContextMenu = {this.distroyTrap.bind(null,i)} key = {i} msg_top = {this.desc} msg_bottom = {TRAP_DATA[tmp.type].desc} msg_top_color = {COLOR.BLUE} />)
                }
            };
            for (var i = list.length; i < size; i++) {
                result.push(<VectorComponent key = {i}/>);
            };
            return result;
        }
        function getTrapTypeDesc(){
            var list = TRAP_DATA;
            var result = [];
            var count = 0

            var chanceLevel = this.context.getScienceLevel('trapChance');
            var getLevel = this.context.getScienceLevel('trapGet');
            var trap = this.context.buildingSaveData.trap;

            for (var attr in  list) {
                var tmp = list[attr];
                if(tmp.science && (!this.context.boxSaveData.scienceTable.things[tmp.science]))continue;
                var isFull = trap.size <= trap.list.length;
                result.push(<tr key = {count}>
                                <td style={{color:COLOR.BLUE}}>{this.desc + tmp.desc}</td>
                                <td><RequireComponent haveBox ={true} requireList = {tmp.require} /></td>
                                <td><ProgressComponent current = {tmp.chance * (1 + chanceLevel * 0.5)} max = {1} /></td>
                                <td><RequireComponent isGreen = {true}  requireList = {cloneMul(tmp.itemGet,1 + 0.5 * getLevel)} separator = ' 或 ' /></td>
                                <td><BtnComponent style = {{margin:'0px'}} requireList = {tmp.require} disabled = {isFull} handleClick = {this.makeTrap.bind(this,attr)} desc = "设置" /></td>
                            </tr>);

                count ++;
            };
            return result;
        }
        return  <div>
                    <p>放入诱饵，可以捕获小动物。</p><br/>
                    <div className = "trap">
                        {getListDisplay.bind(this)()}
                        <BtnBack/>
                    </div>
                    <div className = "tableOuter trapTableOuter">
                        <table className="table table-condensed table-hover">
                            <thead><tr><td>陷阱</td><td>需求</td><td>捕获几率/日</td><td>收益</td><td></td></tr></thead>
                            <tbody>
                                {getTrapTypeDesc.bind(this)()}
                            </tbody>
                        </table>
                    </div>
                </div>

    }
})
var CookerComponent = React.createClass({
    timeNeed:1,
    contextTypes:{
        boxSaveData:React.PropTypes.object.isRequired,
        useItem    :React.PropTypes.func.isRequired,
        changeItem :React.PropTypes.func.isRequired,
        useTime    :React.PropTypes.func.isRequired,
    },
    render:function(){
        return<div>
                    <p>你可以使用炊具更大程度地利用食物。</p><p>将<span style = {{color:COLOR.GREEN}}>食材</span>放入空槽以烹调</p>
                    <div>
                        <BoxComponent box = 'cooker'/>
                        {' => '}
                        <BoxComponent box = 'cooked'/>
                    </div>
                    <StudioComponent desc = '烹调' type = 'cooked'/>
                    <div>
                        <StudioComponent isBuildingUpdate = {true} type = 'cookerUpdate'/>
                    </div>
                    <BtnBack/>
                </div>
    }
})
var WellComponent = React.createClass({
    contextTypes:{
        boxSaveData     :React.PropTypes.object.isRequired,
        getBuildingLevel:React.PropTypes.func.isRequired,
        season          :React.PropTypes.string.isRequired,
        skill           :React.PropTypes.object.isRequired,
    },
    render:function(){
        var level = this.context.getBuildingLevel('wellUpdate');
        var yieldAmount = (3 + level )* ((this.context.skill.manage || 0)*SKILL_DATA.manage.buff + 1);
        if(this.context.season == 'winter'){
            return <div>
                    <p>井水结冰了。</p>
                    <BtnBack/>
                </div>
        }
        return  <div>
                    <p>当前水井深度等级：<span style = {{color:COLOR.BLUE}}>{level}</span></p>
                    <p>每日产水量：<span style = {{color:COLOR.BLUE}}>{yieldAmount}</span></p>
                    <BoxComponent box = 'well'/>
                    <StudioComponent isBuildingUpdate = {true} type = 'wellUpdate'/>
                    <BtnBack/>
                </div>
    }
})
var ToiletComponent = React.createClass({
    contextTypes:{
        placeSaveData   :React.PropTypes.object.isRequired,
        getBuildingLevel:React.PropTypes.func.isRequired,
        season:React.PropTypes.string.isRequired,
        getEnveronmentTemperature:React.PropTypes.func.isRequired,
    },
    render:function(){
        var shitCanGet = {san:2,shit:4};
        var showerCanGet = {san:30};
        showerCanGet.temp = (this.context.season == 'winter')?20 : -10;
        var level =  this.context.getBuildingLevel('toiletUpdate');
        var season = this.context.season;
        return  <div>
                    <div>
                        <ActionComponent coolDown = {48} action = 'shit' type = 'shit' canGet = {shitCanGet} timeNeed = {1} desc = '排便'/>
                    </div>
                    <div>
                        {level>0&&season=='winter'?<p>在冬天洗澡，你需要额外的燃料。</p>:null}
                        {level>0?<ActionComponent coolDown = {24} action = 'shower' canGet = {showerCanGet} require = {season=='winter'?{water:4,wood:2}:{water:4}} timeNeed = {1} desc = '洗澡'/>:null}
                    </div>
                    <div>
                        <BoxComponent box = 'shit'/>
                        {level>1?(
                            <div style = {{display:'inline-block',verticalAlign:'middle'}}>
                                <table className = 'table table-hover table-condensed'>
                                    <thead><tr><td>沼气池</td></tr></thead>
                                    <tbody><tr><td><BoxComponent box = 'marshGasTank'/></td></tr></tbody>
                                </table>
                            </div>
                        ):null}
                        <BtnBack/>
                    </div>
                    <StudioComponent isBuildingUpdate = {true} type = 'toiletUpdate'/>
                </div>
    }
})
var SleepPlaceComponent = React.createClass({
    contextTypes:{
        getBuildingLevel:React.PropTypes.func.isRequired,
        season:React.PropTypes.string.isRequired,
        boxSaveData:React.PropTypes.object.isRequired,
    },
    render:function(){
        function getLevelDesc(level){
            var map = {
                0:'地板',
                1:'木床',
                2:'凉席',
                3:'高级床',
                4:'特级床',
            }
            return map[level];
        }
        var level = this.context.getBuildingLevel('sleepPlaceUpdate');
        var map = {
            0:1,
            1:1.5,
            2:2,
            3:2.5,
            4:3,
        }
        var sleepCanGet = {ps:10,hp:0.5,san:0.5};
        var waitCanGet = {ps:1};
        var mul = map[level];
        sleepCanGet = cloneMul(sleepCanGet,mul);
        var season = this.context.season;
        var boxSaveData = this.context.boxSaveData;
        var disabled = season == 'winter' && !boxSaveData.scienceTable.things['heatedBed'];

        function getSeasonDesc(){
            if(disabled){
                return <p>在寒冷的冬天，如果我不烧点柴火睡觉的话，我会冻死的（需要科技<span style = {{color:COLOR.BLUE}}>[火炕]</span>）。</p>;
            }else{
                if(season == 'winter'){
                    return <p>在冬天睡觉需要燃料。</p>
                }
            }
        }
        var props = season=='winter'?{temp:10}:{};
        return  <div>
                    <div>
                        当前床铺等级：<span style = {{color:COLOR.BLUE}}>[{getLevelDesc(this.context.getBuildingLevel('sleepPlaceUpdate'))}]</span>
                    </div>
                    <div>
                        {getSeasonDesc()}
                        {!disabled?<ActionComponent disabled = {disabled} type = 'sleep'  require = {season=='winter'?{wood:1}:{}}  canGet = {sleepCanGet} props = {props} changable = {true} desc = '睡觉'/>:<div className = 'schedule'><table className = 'table'><thead><tr><td>无法使用</td></tr></thead></table></div>}
                        {null/*season=='winter'?<ActionComponent type = 'wait' canGet = {waitCanGet} desc = '躺着'/>:null*/}
                    </div>
                    <StudioComponent isBuildingUpdate = {true} type = 'sleepPlaceUpdate'/>
                    <BtnBack/>
                </div>
    }
})
//scene components
//场景
var PlaceComponent = React.createClass({
    //Adventure begins
    //冒险的场景
    getDefaultProps:function(){
        return {
            reActionDisabled:false,
            place:''
        }
    },
    getInitialState:function(){
        return {
            isActing:false,
            resourceName:null,
        };
    },
    contextTypes:{
        setTitle            :React.PropTypes.func.isRequired,
        placeSaveData       :React.PropTypes.object.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        checkHaveResourceAll:React.PropTypes.func.isRequired,
        playerStateUse      :React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        getMstCircle        :React.PropTypes.func.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        changeItem          :React.PropTypes.func.isRequired,
        AudioEngine         :React.PropTypes.object.isRequired,
        eventSaveData       :React.PropTypes.object.isRequired,
        season              :React.PropTypes.string.isRequired,
        dungeonSaveData     :React.PropTypes.object.isRequired,
        campSaveData        :React.PropTypes.object.isRequired,
        currentEquip        :React.PropTypes.object.isRequired,
        skill               :React.PropTypes.object.isRequired,
        getScienceLevel     :React.PropTypes.func.isRequired,
    },
    resourceDec:function(resourceName){
        var resource = this.context.placeSaveData[this.props.place].resource[resourceName];
        resource.amount -= 1;
        this.context.setStateFromChildren({placeSaveData:this.context.placeSaveData});
    },
    checkDisabled:function(resourceName){
        var tar = this.getRequire(PLACE_DATA[this.props.place].resource[resourceName].require);
        tar = cloneMul(tar,1);
        var result = !this.context.checkHaveResourceAll(tar);
        result = result || (this.context.placeSaveData[this.props.place].resource[resourceName].amount <= 0);
        return result;
    },
    componentWillMount:function(){
        this.context.setTitle((PLACE_DATA[this.props.place] && PLACE_DATA[this.props.place].name)||'');
    },
    componentDidMount:function(){
    },
    handleStartAction:function (resourceName) {
        var boxSaveData = this.context.boxSaveData;
        boxSaveData.register.things = {};
        this.context.setStateFromChildren({boxSaveData:boxSaveData});
        this.handleAction(resourceName);
    },
    getTimeNeed:function(resourceName){
        var resource = PLACE_DATA[this.props.place].resource[resourceName];
        var timeNeed = resource.timeNeed;
        var currentEquip = this.context.currentEquip;
        for(var attr in currentEquip){
            if(!currentEquip[attr])continue;
            timeNeed *=  1 - (ITEM_DATA[currentEquip[attr]].collectSpeed || 0);
        }
        return timeNeed;
    },
    getRequire:function(require){
        var level = this.context.getScienceLevel('collectDec');
        function mul(obj,mul){
            var o = {};
            var mul = mul||1;
            for (var attr in obj) {
                if(ITEM_DATA[attr]){
                    o[attr] = obj[attr];
                    continue;
                }
                var num = mul * obj[attr];
                o[attr] = Math.round(num);
            };
            return o;
        }
        return mul(require,Math.pow(0.8,level));
    },
    handleAction:function(resourceName){
        var resource = PLACE_DATA[this.props.place].resource[resourceName];
        var timeNeed = this.getTimeNeed(resourceName);
        var currentEquip = this.context.currentEquip;

        var box = this.context.boxSaveData.register;
        var name = this.props.place;
        var callBack = function(){
            var greedyLevel = (this.context.skill.greedy || 0) * SKILL_DATA.greedy.buff;//贪婪加成
            var things = cloneMul(resource.things,1 + greedyLevel);

            this.context.playerStateUse(this.getRequire(resource.require));
            this.context.changeItem(things,'register');
            this.setState({isActing:true,resourceName:resourceName});
        }
        this.context.useTime(callBack.bind(this),timeNeed);
        this.resourceDec(resourceName);
    },
    getRandomMst:function(){
        var list = this.context.placeSaveData[this.props.place].mst;
        return getRandomThing(list);
    },
    handleBattle:function(){
        this.context.useTime(function(){
            var mst = this.getRandomMst().attr;
            var wind = <BattleComponent reHunt = {this.handleBattle} mst = {mst} placeName = {this.props.place}/>
            this.context.callWindow(wind);
        }.bind(this),0.5);
    },
    setDecThings:function(totalGet){
        //after pick things ,need to set things dec
        var name = this.props.place;
        var placeData = this.context.placeSaveData[name];
        var things = placeData.things;
        for(var attr in things){
            for(var attr_2 in totalGet){
                if(attr == attr_2){
                    things[attr] -= totalGet[attr];
                    if(things[attr]<=0){
                        delete things[attr];
                    }
                }
            }
        }
    },
    handlePick:function(){
        var name = this.props.place;
        var placeData = this.context.placeSaveData[name];
        var things = placeData.things;
        var getAmount = Math.floor(getRandomThing(things).total/10) + 2;
        var totalGet = {};
        for (var i = getAmount; i >= 0; i--) {
            var get = getRandomThing(things).attr;
            if(!get)break;
            if(totalGet[get]){
                totalGet[get]+=1;
            }else{
                totalGet[get] = 1;
            }
        };

        var greedyLevel = (this.context.skill.greedy || 0) * SKILL_DATA.greedy.buff;//贪婪加成
        totalGet = cloneMul(totalGet, 1 + greedyLevel);

        function callBack(){
            var require = PLACE_DATA[name].pickRequire || {ps:3};
            this.context.playerStateUse(require);
            this.context.callWindow(<RegisterComponent willUnmount = {this.setDecThings.bind(this,totalGet)} itemList = {totalGet}/>);
        }
        this.context.useTime(callBack.bind(this),PICK_TIME);
    },
    handleEvent:function(event){
        var wind = <EventComponent type = {event} />;
        this.context.callWindow(wind);
    },
    getPermittion:function(){
        var name = this.props.place;
        var campSaveData = this.context.campSaveData;
        var placeSaveData = this.context.placeSaveData;
        if(name == 'ice' || name == 'fire'){
            var flag = true;
            for(var attr in placeSaveData[name].mst){
                if(placeSaveData[name].mst[attr].amount != 0){
                    flag = false;
                    break;
                };
            }
            if(flag)return true;
        }

        if((name == 'ice' || name == 'fire') && (name != campSaveData.choice ))return false;
        return true;
    },
    getEnermy:function(){
        var name = this.props.place;
        var campSaveData = this.context.campSaveData;
        if((name == 'ice' || name == 'fire') && (name == campSaveData.choice || !campSaveData.choice))return false;

        //本区域没有怪兽
        if(getLength(this.context.placeSaveData[name].mst) == 0){
            return false;
        }

        return true;
    },
    render:function(){
        var name = this.props.place;
        if(name == 'upgradePlace'){
            return <UpgradePlaceComponent/>
        }
        var placeData = this.context.placeSaveData[name];
        if(this.state.isActing){
            var resourceName = this.state.resourceName;
            var disabled = this.checkDisabled(resourceName);
            return (
                    <div>
                        <BtnComponent disabled = {disabled} handleClick = {this.handleAction.bind(this,resourceName)} desc = {PLACE_DATA[name].resource[resourceName].action}/>
                        <RegisterComponent canBack = {false}/>
                        <BtnBack callBack = {function () {
                            this.setState({isActing:false});
                        }.bind(this)}/>
                    </div>
            )
        }
        function getCircleDesc(speed){
            function getColor(){
                var r,g,b;
                var speed_1 = 0.2;
                var speed_2 = 0.5;
                var color_0 = {r:76,g:168,b:153}
                var color_1 = {r:77,g:180,b:154}
                var color_2 = {r:194,g:154,b:77}
                if(speed<speed_1){
                    r = speed*(color_1.r - color_0.r) + color_0.r;
                    g = speed*(color_1.g - color_0.g) + color_0.g;
                    b = speed*(color_1.b - color_0.b) + color_0.b;
                }else{
                    if(speed < speed_2){
                        r = (speed-speed_1)*( color_2.r - color_1.r) + color_1.r;
                        g = (speed-speed_1)*( color_2.g - color_1.g) + color_1.g;
                        b = (speed-speed_1)*( color_2.b - color_1.b) + color_1.b;
                    }else{
                        r = color_2.r;
                        g = color_2.g;
                        b = color_2.b;
                    }
                }
                r = Math.ceil(r);
                g = Math.ceil(g);
                b = Math.ceil(b);
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }
            function getDesc(){
                if(speed == 0)  return '停止';
                if(speed <= 0.1)return '非常慢';
                if(speed <= 0.2)return '很慢';
                if(speed <= 0.3)return '较慢';
                if(speed <= 0.4)return '一般';
                if(speed <= 0.5)return '很快';
                if(speed <= 1)  return '较快';
                return '非常快';
            }
            return <span style = {{color:getColor()}}>{getDesc()}</span>
        };


        var greedyLevel = (this.context.skill.greedy || 0) * SKILL_DATA.greedy.buff;//贪婪加成

        var eventSaveData = this.context.eventSaveData;
        function getRecources(){
            if(!this.getPermittion())return null;
            var result = [];
            for (var attr in PLACE_DATA[name].resource) {
                var tmp = placeData.resource[attr];
                if(!tmp)continue;

                var ev = PLACE_DATA[name].resource[attr].event;
                lll(PLACE_DATA[name].resource[attr])
                lll(ev)
                lll(eventSaveData)
                lll(eventSaveData[ev])
                if( ev && (!eventSaveData[ev] || !eventSaveData[ev].experienced)){
                    continue;
                }


                var disabled = this.checkDisabled(attr);
                var season = this.context.season;

                //服从生物曲线
                var speed = this.context.getMstCircle(tmp.amount, PLACE_DATA[name].resource[attr].initAmount,PLACE_DATA[name].resource[attr].circle);
                var speed = season == 'winter'?0:speed;

                result.push(<tr key = {attr}>
                                <td>{PLACE_DATA[name].resource[attr].name}</td>
                                <td>{tmp.amount}</td>
                                <td>{getCircleDesc(speed)}</td>
                                <td><RequireComponent isGreen = {true} requireList = {cloneMul(PLACE_DATA[name].resource[attr].things,1 + greedyLevel)}/></td>
                                <td><RequireComponent requireList = {this.getRequire(PLACE_DATA[name].resource[attr].require)}/></td>
                                <td><BtnComponent canEvent = {true}  disabled = {disabled}  handleClick = {this.handleStartAction.bind(this,attr)} desc = {PLACE_DATA[name].resource[attr].action}/></td>
                            </tr>)
            };
            return result;
        };
        function getMsts(){
            if(!this.getEnermy())return null;
            var result = [];
            var mstList = placeData.mst;
            //按钮信息
            var huntDesc = PLACE_DATA[name].huntDesc || '狩猎';
            result.push(<tr key = {'resource_mst'}>
                            <td>{huntDesc}</td>
                            <td colSpan = {3}><ResourceDisplayComponent type = 'mst' resource = {mstList}/></td>
                            <td></td>
                            <td><BtnComponent disabled = {this.getRandomMst().attr == false} canEvent = {true} handleClick = {this.handleBattle} desc = {huntDesc}/></td>
                        </tr>)
            return result;
        };
        function getEvents(){
            if(this.getEnermy() && (name == 'fire' || name == 'ice'))return null;
            //设置事件
            if(!PLACE_DATA[name].event)return null;
            var result = [];
            for(var attr in PLACE_DATA[name].event){
                var eventSaveData = this.context.eventSaveData;
                if(eventSaveData[attr].experienced)continue;
                var data = EVENT_DATA[attr];
                if(data.event && !eventSaveData[data.event].experienced)continue;
                result.push(<tr key = {'event_' + attr}><td>{data.name}</td><td colSpan = '4'>{data.desc}</td><td><BtnComponent  handleClick = {this.handleEvent.bind(this,attr)} desc = {data.btn || '对话'} /></td></tr>);
            }
            return result;
        }
        function getPick(){
            if(!this.getPermittion())return null;
            //设置拾荒
            if(!getLength(placeData.things))return null;
            var pickDesc = PLACE_DATA[name].pickDesc || '拾荒';
            var pickRequire = PLACE_DATA[name].pickRequire || {};
            if(!pickRequire.ps)pickRequire.ps = 3;
            var disabled = !this.context.checkHaveResourceAll(pickRequire);
            return <tr><td>{PLACE_DATA[name].thingsDesc || pickDesc}</td><td colSpan = {3}><ResourceDisplayComponent resource = {placeData.things}/></td><td><RequireComponent requireList = {pickRequire}/></td><td><BtnComponent disabled = {disabled} desc = {pickDesc} handleClick = {this.handlePick} /></td></tr>
        }
        function getEntry(){
            function goToDunguen(){
                var dungeonSaveData = this.context.dungeonSaveData;
                dungeonSaveData.stairCount = 1;
                dungeonSaveData.roomCount = 1;
                dungeonSaveData.room = {
                            desc:<p>阴森的地牢传出恐怖的声音。</p>
                        };
                this.context.setStateFromChildren({
                    currentScene:'dungeon',
                    dungeonSaveData:dungeonSaveData,
                });
            }
            if(PLACE_DATA[name].entry == 'dungeon'){
                return <tr><td colSpan = {6}>
                            <BtnComponent desc = '前往地牢' handleClick = {goToDunguen.bind(this)}/>
                        </td></tr>
            }
        }
        var haveResources = getLength(placeData.resource)>0;
        return  <div className = "tableOuter">
                    <table className="table table-condensed table-hover">
                    {this.getPermittion() && haveResources?<thead><tr><td>资源</td><td>总量</td><td>生长</td><td>获得物品</td><td>需要</td><td></td></tr></thead>:null}
                    <tbody>
                        {getEntry.bind(this)()}
                        {getRecources.bind(this)()}
                        {getPick.bind(this)()}
                        {getMsts.bind(this)()}
                        {getEvents.bind(this)()}
                    </tbody>
                    </table>
                    <BtnHome placeName = {name}/>
                </div>
    }
});
var HomeComponent = React.createClass({
    getDefaultProps:function(){
        return {
        }
    },
    getInitialState:function(){
        return {
            war:false,
        }
    },
    contextTypes:{
        setTitle            : React.PropTypes.func.isRequired,
        buildingSaveData    : React.PropTypes.object.isRequired,
        boxSaveData         : React.PropTypes.object.isRequired,
        setCurrentScene     : React.PropTypes.func.isRequired,
        settings            : React.PropTypes.object.isRequired,
        upload              : React.PropTypes.func.isRequired,
        time                : React.PropTypes.object.isRequired,
        robberSaveData      : React.PropTypes.object.isRequired,
        callWindow          : React.PropTypes.func.isRequired,
        setStateFromChildren: React.PropTypes.func.isRequired,
    },
    componentWillMount:function(){
        this.context.setTitle('家');
    },
    handleGoOut:function(){
        this.context.setCurrentScene('branch');
        var settings = this.context.settings;
        if(settings.autoSave){
            this.context.upload(true);
        }
    },
    getOwnAndUnOwnNumber:function(list){
        var countOwn = 0;
        var countUnOwn = 0;
        for (var attr in list) {
            if(list[attr].own){
                countOwn++;
            }else{
                countUnOwn++;
            }
        };
        return {countOwn:countOwn,countUnOwn:countUnOwn};
    },
    isAllScienceLearned:function(){
        var scienceTable = this.context.boxSaveData.scienceTable.things;
        for(var attr in SCIENCE_DATA){
            if(!scienceTable[attr]) return false;
        }
        return true;
    },
    handleWar:function(){
        var robberSaveData = this.context.robberSaveData;
        var time = this.context.time;
        this.setState({war:true});
    },
    handleKnown:function(){
        var robberSaveData = this.context.robberSaveData;
        robberSaveData.stoled = {};
        this.context.setStateFromChildren({robberSaveData:robberSaveData});
    },
    render:function(){
        var robberSaveData = this.context.robberSaveData;
        var time = this.context.time;
        if(this.state.war){
            var mst = robberSaveData.robber;
            var mstState = {
                maxHp:ROBBER_DATA[mst].hpInc * time.day + MST_DATA[mst].maxHp,
                dmg:ROBBER_DATA[mst].dmgInc * time.day + MST_DATA[mst].damage,
            }
            var self = this;
            var winScene = <div>
                    你冷静地消灭了敌人。。。
                    <BtnComponent desc = '回家' handleClick = {function(){
                        robberSaveData.robber = null;
                        self.context.callWindow(null);
                    }}/>
                </div>;
            return <BattleComponent winScene = {winScene} mstState = {mstState} mst = {mst}/>;
        }

        if(robberSaveData.robber){
            return <div>
                        <p>一群盗贼撬开了你的门！你被围攻了！</p>
                        <BtnComponent handleClick = {this.handleWar} desc = '战斗！'/>
                    </div>;
        }

        if(getLength(robberSaveData.stoled) != 0){
            return <div>
                        <p>一群盗贼抢劫了你的家！</p>
                        <p>失去的物品：</p>
                        <div>
                            <RequireComponent isGreen = {true} requireList = {robberSaveData.stoled} />
                            <RegisterComponent itemList = {{traces:1}} canBeEmpty = {true} canBack = {false} />
                        </div>
                        <BtnComponent handleClick = {this.handleKnown} desc = '接受现实'/>
                    </div>;
        }
        var result = [];
        var buildings = this.context.buildingSaveData;
        var getBuildingList = function(buildings){
            //建筑数量
            var countUnOwn = 0;
            for (var attr in buildings) {
                if(!buildings[attr].own){
                    countUnOwn++;
                }
            };

            for (var attr in buildings) {
                if(!buildings[attr].own || (countUnOwn == 0 && attr == 'build'))continue;


        //检查为空
                if(attr == 'build' && (this.getOwnAndUnOwnNumber(buildings).countUnOwn == 0))continue;
                if(attr == 'scienceTable' && this.isAllScienceLearned() == true)continue;

                result.push(<BuildingComponent key = {attr} building = {attr}/>);
            };
            return result;
        }
        return <div>
                    <div className = 'home'>
                        {getBuildingList.bind(this,this.context.buildingSaveData)()}
                    </div>
                    <div>
                        <BtnComponent desc = '出门' handleClick = {this.handleGoOut}/>
                    </div>
                </div>
    }
});
var BranchComponent = React.createClass({
    contextTypes:{
        placeSaveData  :React.PropTypes.object.isRequired,
        setStateFromChildren  :React.PropTypes.func.isRequired,
        useTime        :React.PropTypes.func.isRequired,
        setCurrentScene:React.PropTypes.func.isRequired,
        AudioEngine    :React.PropTypes.object.isRequired,
        eventSaveData  :React.PropTypes.object.isRequired,
        boxSaveData    :React.PropTypes.object.isRequired,
        currentEquip   :React.PropTypes.object.isRequired,
        getTimeNeed    :React.PropTypes.func.isRequired,
        season         :React.PropTypes.string.isRequired,
    },
    handleGo:function(placeName){
        var placeSaveData = clone(this.context.placeSaveData);
        placeSaveData[placeName].visited = true;
        this.context.setStateFromChildren({placeSaveData:placeSaveData});
        this.context.AudioEngine.playEffect('door');

        var timeNeed = this.context.getTimeNeed(placeName);

        function callBack(){
            this.context.setCurrentScene(placeName);
        }
        this.context.useTime(callBack.bind(this),timeNeed);
    },
    render:function(){
        var placeList = this.context.placeSaveData;
        function getPlaceDisplay(){
            var result = [];
            for (var attr in PLACE_DATA) {
                if(!placeList[attr]){
                    return;
                }
                if(MODE != 'DEBUG'){
                    //需要事件的情况
                    if(PLACE_DATA[attr].requireEvent &&  this.context.eventSaveData[PLACE_DATA[attr].requireEvent].experienced == false)continue;
                    //需要科技的情况
                    if(PLACE_DATA[attr].science &&  this.context.boxSaveData.scienceTable.things[PLACE_DATA[attr].science] == undefined)continue;
                    //需要季节的情况
                    if(PLACE_DATA[attr].season &&  this.context.season != PLACE_DATA[attr].season)continue;
                }
                result.push(<tr key = {attr}>
                                 <td>{PLACE_DATA[attr].name}{placeList[attr].visited?null:<span style = {{color:COLOR.GREEN}}> new</span>}</td>
                                 <td><ResourceDisplayComponent resource = {placeList[attr].things}/></td>
                                 <td>{this.context.getTimeNeed(attr).toFixed(1)}</td>
                                 <td><BtnComponent desc = '出发' handleClick = {this.handleGo.bind(this,attr)} /></td>
                            </tr>);
            };
            return result;
        };
        return  <div>
                    <div className = "branch">
                        <table style = {{marginBottom:0,paddingBottom:0}} className="table table-condensed table-hover">
                            <thead><tr><td>地点</td><td>资源</td><td>耗时</td><td></td></tr></thead>
                            <tbody>
                                {getPlaceDisplay.bind(this)()}
                            </tbody>
                        </table>
                    </div>
                    {this.context.eventSaveData.trade.experienced?<TradeListComponent/>:null}
                    <BtnHome/>
                </div>

    }
});
var BattleCharactorComponent = React.createClass({
    getDefaultProps:function(){
        return{
            name:'',
            maxHp:100,
            currentHp:null,
            placeName:null,
            prefix:{},
        }
    },
    getPrefix:function(){
        var prefix = this.props.prefix;
        var result = [];
        for(var attr in prefix){
            result.push(<span key = {attr}>{PREFIX_DATA[attr].name}</span>);
        }
        return result;
    },
    render:function(){
        var name = this.props.name;
        var currentHp = this.props.currentHp;
        var maxHp = this.props.maxHp;
        return  <div className = "battleCharactor you">
                    <ProgressComponent addClass = 'hpProgress' addClassIn = 'hpProgressIn' current = {Math.ceil(currentHp)} max = {Math.ceil(maxHp)}/>
                    <p>{Math.ceil(currentHp)}/{Math.ceil(maxHp)}</p>
                    <p>{this.getPrefix()}{this.props.name}</p>
                </div>
    }
});
var SelectComponent = React.createClass({
    getDefaultProps:function(){
        return{
            index:0,
            handleChange:null,
            defaultV:null,
        }
    },
    handleChange:function(sender){
        var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        var value = obj.value;
        this.props.handleChange(this.props.index,value);
    },
    render:function(){
        return <select className = "selectpicker"  value = {ITEM_DATA[this.props.defaultV].name} onChange = {this.handleChange}>{this.props.children}</select>
    }
})
var BattleChoiceComponent = React.createClass({
    timer:null,
    contextTypes:{
        useTime             :React.PropTypes.func.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        defaultWeapon       :React.PropTypes.array.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        playerStateUse      :React.PropTypes.func.isRequired,
        playerState         :React.PropTypes.object.isRequired,
        checkHaveResourceAll:React.PropTypes.func.isRequired,
    },
    componentWillMount:function(){
        var defaultWeapon = this.context.defaultWeapon;
        var boxSaveData = this.context.boxSaveData;
        for (var i = 0; i < 2; i++) {
            if(!boxSaveData.bag.things[defaultWeapon[i]]){
                defaultWeapon[i] = this.getFirstWeapon();
            };
        };
    },
    componentWillUnmount:function(){
        clearInterval(this.timer);
    },
    getDefaultProps:function(){
        return{
            getDamage   :null,
            mstDmg      :0,
            handleAttack:null,
            handleRun   :null,
            mst         :null,
            getChance   :null,
            getRunChance:null,
            getRequire  :null,
        }
    },
    getAllWeaponsInBag:function(){
        var result = {};
        var bagThings = this.context.boxSaveData.bag.things;
        result['noWeapon'] = true;
        for(var attr in bagThings){
            if(ITEM_DATA[attr].type == 'weapon'){
                result[attr] = true;
            }
        }
        return result;
    },
    getInitialState:function(){
        return {
            intervalIndex    :null,
        }
    },
    getFirstWeapon:function(){
        var allWeapon = this.getAllWeaponsInBag();
        for(var attr in allWeapon){
            var firstWeapon = attr;
            break;
        }
        return firstWeapon;
    },
    handleChange:function(index,weaponName){
        for(var attr in ITEM_DATA){
            if(ITEM_DATA[attr].name == weaponName)break;
        }
        var defaultWeapon = this.context.defaultWeapon;
        defaultWeapon[index] = attr;
        this.context.setStateFromChildren({defaultWeapon:defaultWeapon});
    },
    checkWeaponDisabled:function(selectedWeapon){
        var data = ITEM_DATA[selectedWeapon];
        var bullet = data.bullet;
        var require = data.require;
        var bag = this.context.boxSaveData.bag.things;
        if(bullet&&!bag[bullet]){
            return true;
        }
        if(require&&!this.context.checkHaveResourceAll(require)){
            return true;
        }
        return false;
    },
    getWeapon:function(index){
        var defaultWeapon = this.context.defaultWeapon;
        var weapons = this.getAllWeaponsInBag();
        var boxSaveData = this.context.boxSaveData;
        var selectedWeapon = (boxSaveData.bag.things[defaultWeapon[index]] && defaultWeapon[index])||this.getFirstWeapon();
        return selectedWeapon;
    },
    handleInterval:function(index){
        if(index == this.state.intervalIndex){
            clearInterval(this.timer);
            this.setState({intervalIndex:null});
        }else{
            if(this.state.intervalIndex != null){
                clearInterval(this.timer);
            }
            this.setState({intervalIndex:index});
            this.timer = setInterval(function(){
                var selectedWeapon = this.getWeapon(this.state.intervalIndex);
                ((this.context.playerState.hp.amount > this.props.mstDmg) && (this.state.intervalIndex != null) && !this.checkWeaponDisabled(selectedWeapon))?(this.props.handleAttack(selectedWeapon)):null;
            }.bind(this),500);
        }
    },
    render:function(){
        var defaultWeapon = this.context.defaultWeapon;
        var weapons = this.getAllWeaponsInBag();
        var boxSaveData = this.context.boxSaveData;
        function getOptions(index){
            var result = [];
            for(var attr in weapons){
                result.push(<option key = {index+'_'+attr}>{ITEM_DATA[attr].name}</option>)
            }
            return result;
        }
        function getWeaponRow(index){
            var result = [];
            for (var index = 0; index < 2; index++) {
                var selectedWeapon = this.getWeapon(index);
                var chance = this.props.getChance(selectedWeapon);
                //武器类型
                var type = ITEM_DATA[selectedWeapon].weaponType;
                var typeDesc = {
                    melee:'攻击',
                    shoot:'射击',
                    magic:'施放',
                }
                //武器使用费用
                var require = this.props.getRequire(selectedWeapon);

                result.push(<tr key = {index}>
                                <td><SelectComponent defaultV = {selectedWeapon} handleChange = {this.handleChange} index = {index}>{getOptions(index)}</SelectComponent></td>
                                <td>射程优势(<span style = {{color:chance>0?COLOR.GREEN:COLOR.RED}}>{Math.ceil(chance*100)}%</span>)</td>
                                <td><RequireComponent requireList = {require}/></td>
                                <td><span className = 'damage'>{this.props.getDamage(selectedWeapon)}</span> vs <span className = 'damage'>{this.props.mstDmg}</span></td>
                                <td><BtnComponent desc = {typeDesc[type]||'攻击'} disabled = {this.checkWeaponDisabled.bind(this,selectedWeapon)()} handleRightClick = {this.handleInterval.bind(null,index)} handleClick = {this.props.handleAttack.bind(null,selectedWeapon)}/></td>
                            </tr>);
            };
            return  result;
        }
        function getRunRow(index){
                return  <tr>
                            <td></td>
                            <td colSpan = {1}>成功几率({(Math.round(this.props.getRunChance()*100))}%)</td>
                            <td></td>
                            <td><span className = 'damage'>0</span> vs <span className = 'damage'>{this.props.mstDmg}</span></td>
                            <td><BtnComponent desc = '跑路' handleClick = {this.props.handleRun}/></td>
                        </tr>
        }
        return <div>
                    <div className = "tableOuter">
                    <table className = "battleTable table table-condensed table-hover">
                        <tbody>
                        {getWeaponRow.bind(this)()}
                        {getRunRow.bind(this)()}
                        </tbody>
                    </table>
                    </div>
                </div>
    }
});
var BattleComponent = React.createClass({
    //战斗的整体场景
    step:0,
    battleTurnTime : 0,
    contextTypes:{
        playerStateChange   :React.PropTypes.func.isRequired,
        playerState         :React.PropTypes.object.isRequired,
        mstStateChange      :React.PropTypes.func.isRequired,
        mstState            :React.PropTypes.object.isRequired,
        placeSaveData       :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        useItem             :React.PropTypes.func.isRequired,
        callWindow          :React.PropTypes.func.isRequired,
        playerStateUse      :React.PropTypes.func.isRequired,
        showMsg             :React.PropTypes.func.isRequired,
        msgList             :React.PropTypes.array.isRequired,
        skill               :React.PropTypes.object.isRequired,
        menuHint            :React.PropTypes.number.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        currentEquip        :React.PropTypes.object.isRequired,
        durableSaveData     :React.PropTypes.object.isRequired,
        getMaxState         :React.PropTypes.func.isRequired,
        generation          :React.PropTypes.number.isRequired,
    },
    getDefaultProps:function(){
        return {
            mst:null,
            mstState:null,
            prefix:{},
            onWin:null,
            winScene:null,
        }
    },
    getChance:function(weapon){
        //工具攻击范围获得命中率
        var skill = this.context.skill;
        var level = (skill['agile']||0)
        var chance = 0;

        //获得装备加成
        var buff = 0;
        var currentEquip = this.context.currentEquip;
        for(var attr in currentEquip){
            var equip = currentEquip[attr];
            if(!equip)continue;
            buff += ITEM_DATA[equip].agileInc || 0;
        }

        var playerRange = ITEM_DATA[weapon].range + level*(SKILL_DATA['agile']['buff'] || 0)  + buff;
        var mstRange = this.context.mstState.range;

        //前缀加成
        var prefix = this.props.prefix;
        if(prefix.agile){
            mstRange *= 1 + PREFIX_DATA.agile.buff;
        }

        var gap = Math.abs(playerRange - mstRange);
        var chance = gap/(20+gap);
        chance = chance * (playerRange > mstRange?1:-1);
        return chance;
    },
    componentWillMount:function(){
        this.step = 0;
        if(this.context.mstState.hp!=undefined)return;
        var mst = clone(MST_DATA[this.props.mst]);

        //前缀加成
        var prefix = this.props.prefix;
        if(prefix.fat){
            mst.maxHp = Math.ceil((1 + PREFIX_DATA.fat.buff)*mst.maxHp);
        }
        for(var attr in this.props.mstState){
            mst[attr] = this.props.mstState[attr];
        }
        mst.hp = mst.hp || mst.maxHp;

        this.context.setStateFromChildren({'mstState':mst});
    },
    componentWillUnmount:function(){
        this.context.setStateFromChildren({'mstState':{}});
    },
    getRunChance:function(){
        var mst = this.props.mst;
        var chaseChance = MST_DATA[mst].chaseChance;
        if(!chaseChance)return 1;
        var currentEquip = this.context.currentEquip;
        var equipBuff = 1;
        for(var attr in currentEquip){
            if(!currentEquip[attr])continue;
            equipBuff *= (ITEM_DATA[currentEquip[attr]].runChanceMul || 1);
        }
        var result = 1 - (chaseChance * equipBuff);
        if(result < 0)result = 0;
        return result;
    },
    getDamageBuffType:function(weapon){
        var bullet = ITEM_DATA[weapon].bullet;
        return  ITEM_DATA[weapon].weaponType || (bullet?'shoot':'melee');
    },
    getPlayerDamage:function(selectedWeapon){
        var mstState = this.context.mstState;
        //获得技能加成以及装备加成
        var skill = this.context.skill;
        var type = ITEM_DATA[selectedWeapon].weaponType;
        var bullet = ITEM_DATA[selectedWeapon].bullet;
        var currentEquip = this.context.currentEquip;
        var playerState = this.context.playerState;
        var equipBuff = 0;
                var generation = this.context.generation;
        for(var attr in currentEquip){
            var equip = currentEquip[attr];
            if(!equip)continue;
            equipBuff += ITEM_DATA[equip][type + 'Mul']||0;

            //你已损失的每1%的生命值将为你增加伤害
            if(ITEM_DATA[equip]['hpTo_'+type]){
                var hp = playerState.hp.amount;
                equipBuff += ITEM_DATA[equip]['hpTo_'+type] * (1 - hp/this.context.getMaxState('hp'));
            }


            //你的每次轮回将为你增加伤害
            if(ITEM_DATA[equip]['reiToAtk']){
                equipBuff += ITEM_DATA[equip]['reiToAtk'] * (generation);
            }

        }

        //获得技能加成
        var buffType = this.getDamageBuffType(selectedWeapon);
        var skillBuff = SKILL_DATA[buffType].buff * (skill[buffType]||0);

        //获得前缀加成
        var prefix = this.props.prefix;
        var preBuff = 0;
        if(prefix.magic && ITEM_DATA[selectedWeapon].weaponType == 'magic'){
            preBuff -= PREFIX_DATA.magic.buff;
        }
        if(prefix.def && ITEM_DATA[selectedWeapon].weaponType == 'melee'){
            preBuff -= PREFIX_DATA.def.buff;
        }

        var dmg  = ITEM_DATA[selectedWeapon].damage;
        //特殊武器加成
        if(ITEM_DATA[selectedWeapon].curse){
            dmg += mstState.maxHp * ITEM_DATA[selectedWeapon].curse;
        }
        if(ITEM_DATA[selectedWeapon].reiToDmg){
            dmg += ITEM_DATA[selectedWeapon].reiToDmg * generation;
        }

        switch(selectedWeapon){
            case 'knifeStaff':
            var bag = this.context.boxSaveData.bag.things;
            var amount = 0;
            for(var attr in bag){
                amount += bag[attr] * ((attr == 'flyKnife')?1:0);
                // amount += bag[attr] * ((ITEM_DATA[attr].type == 'weapon' && ITEM_DATA[attr].weaponType == 'melee')?0.5:0);
            }
            dmg += amount>1000?1000:amount;
            break;
            case 'deadStaff':
            var bag = this.context.boxSaveData.bag.things;
            var amount = 0;
            for(var attr in bag){
                amount += bag[attr] * ((attr == 'humanMeat')?2:0);
                // amount += bag[attr] * ((ITEM_DATA[attr].type == 'weapon' && ITEM_DATA[attr].weaponType == 'melee')?0.5:0);
            }
            dmg += amount;
            break;
        }
        dmg *= (1 + skillBuff) * (1 + equipBuff) * (1 + preBuff) * (1/(mstState.hpMul || 1));
        var playerState = this.context.playerState;
        var san = playerState.san.amount / this.context.getMaxState('san');
        dmg *= Math.pow(san,0.3);

        //  龙骨剑随着耐久下降攻击也下降
        if(ITEM_DATA[selectedWeapon].durableDec){
            var durableSaveData = this.context.durableSaveData;
            var mul = durableSaveData[selectedWeapon]/ITEM_DATA[selectedWeapon].durable;
            dmg *= 1 + mul;
        }

        //天赋技能
        dmg *= (skill.fighter || 0) * SKILL_DATA.fighter.buff +1
        return Math.ceil(dmg);
    },
    getMstDamage:function(damage){
        if(this.props.mstState && this.props.mstState.dmg){
            damage = this.props.mstState.dmg;
        }
        var skill = this.context.skill;
        var level = (skill['def'])||0;
        var equipBuff = 1;
        var currentEquip = this.context.currentEquip;
        for(var attr in currentEquip){
            //防具
            var equip = currentEquip[attr];
            if(!equip)continue;

            equipBuff *= (ITEM_DATA[equip].dmgMul||1);

            //你的每1%的体力值将为你增加0.5%的防御。
            var add = 0;
            if(ITEM_DATA[equip].psToDef){
                var ps = this.context.playerState.ps.amount;
                add += ITEM_DATA[equip].psToDef * (ps)/this.context.getMaxState('ps');
            }
            equipBuff *= 1 - add;

            //轮回增加的防御。
            if(ITEM_DATA[equip].reiToDef){
                var lunhui = this.context.generation;
                equipBuff *= Math.pow((1 - ITEM_DATA[equip].reiToDef),lunhui);
            }

        }

        //前缀加成
        var prefix = this.props.prefix;
        if(prefix.atk){
            var preBuff = PREFIX_DATA.atk.buff;
        }else{
            var preBuff = 0;
        }

        var skillDecMul = Math.pow(SKILL_DATA.def.buff,level) * 0.95 + 0.05 * (10/(10 + level));
        
        var dmg  = damage * skillDecMul * (equipBuff) *(1 + preBuff);
        return Math.ceil(dmg);
    },
    getRequire:function(weapon){
        var require = clone(ITEM_DATA[weapon].require);
        var currentEquip = this.context.currentEquip;
        var buff = 1;
        for(var attr in currentEquip){
            var equip = currentEquip[attr];
            if(!equip)continue;

            if(ITEM_DATA[equip].magicCostDec && ITEM_DATA[weapon].weaponType == 'magic'){
                buff *= 1 - ITEM_DATA[equip].magicCostDec;
            }
            if(ITEM_DATA[equip].meleeCostDec && ITEM_DATA[weapon].weaponType == 'melee'){
                buff *= 1 - ITEM_DATA[equip].meleeCostDec;
            }
            if(ITEM_DATA[equip].shootCostDec && ITEM_DATA[weapon].weaponType == 'shoot'){
                buff *= 1 - ITEM_DATA[equip].shootCostDec;
            }
        }
        for(var attr in require){
            require[attr] = Math.round( (buff) * require[attr] );
        }
        return require;
    },
    handleAttack:function(weapon){
        var maxHp = this.context.mstState.maxHp;
        this.step ++ ;
        var mst = this.props.mst;
        var playerDmg = this.getPlayerDamage(weapon);
        var enermyDmg = this.getMstDamage(MST_DATA[mst].damage);
        var currentEquip = this.context.currentEquip;
        var skill = this.context.skill;
        var weaponType = ITEM_DATA[weapon].weaponType;
        var frozenArm = 0;
        for(var attr in currentEquip){
            var equip = currentEquip[attr];
            if(!equip)continue;
            frozenArm += ITEM_DATA[equip].frozenArm || 0;
        }

        var chance = this.getChance(weapon);

        var playerSuccess = Math.random() > -chance;

        var itemData = ITEM_DATA[weapon];
        var mst_feared = itemData.fear?(playerSuccess && (Math.random() < itemData.fear)):false;
        var mst_frozon = (playerSuccess &&  (itemData.frozen?(Math.random() < itemData.frozen):false))||(Math.random() < frozenArm);
        var mst_blocked = !playerSuccess && (itemData.block?(Math.random() < itemData.block):false);

        var mstSuccess = Math.random() > chance &&!(mst_frozon||mst_feared||mst_blocked);

        var timeNeed = this.battleTurnTime;
        var require = this.getRequire(weapon);

        if(playerSuccess){
            //吸取类装备效果
            var rec = {};
            var amount = playerDmg;
            var check = function(o){
                var tar = o.target;
                var buff = o.buff * amount;
                //吸取修正 12/9
                // buff = Math.pow(buff,0.5);
                rec[tar] = (rec[tar] || 0) + buff;
            }
            if(ITEM_DATA[weapon].dmgTo){
                check(ITEM_DATA[weapon].dmgTo);
            }
            for(var attr in currentEquip){
                var equip = currentEquip[attr];
                if(!equip)continue;
                if(ITEM_DATA[equip].dmgTo)check(ITEM_DATA[equip].dmgTo);
            }
            this.context.playerStateUse(rec,true);
        }

        switch(weapon){
            case 'fireStaff':
            var playerState = this.context.playerState;
            playerState.temp.amount += 10;
            if(playerState.temp.amount > 50){
                playerState.temp.amount = 50;
            }
            this.context.setStateFromChildren({playerState:playerState});
            break;
        }
        callBack.bind(this)();


        function getMstDo(){
            if(mst_feared)return <span>害怕地动弹不得！</span>;
            if(mst_frozon)return <span>被冻住了！</span>;
            if(mst_blocked)return <span>的攻击被格挡了！</span>;
            return <span>打歪了！</span>;
        }
        function getRec(){
            var result = [];
            for(var attr in rec){
                result.push(<span>你回复了<span style = {{color:COLOR.GREEN}}>{Math.round(rec[attr])}</span>点{STATE_DATA[attr].name}。</span>);
            }
            return <span key = {'rec_'+attr+this.step}>
                        {result}
                    </span>
        }
        function callBack(){
            if(require)this.context.playerStateUse(require);
            this.context.playerStateUse(o(weapon,1));
            playerSuccess?this.context.mstStateChange({hp:-playerDmg}):null;
            var show = [];
            show.push(playerSuccess?<span key = {'p_atk_'+this.step}>你造成了<span style = {{color:COLOR.GREEN}}>{playerDmg}</span>点伤害！</span>:<span key = {'p_atk_'+this.step} style = {{color:COLOR.RED}}>你打歪了！</span>);
            if(this.context.mstState.hp > 0){
                show.push(mstSuccess?<span key = {'m_atk_'+this.step}>你受到了<span style = {{color:COLOR.RED}}>{enermyDmg}</span>点伤害！</span>:<span key = {'m_atk_'+this.step} style = {{color:COLOR.GREEN}}>{MST_DATA[this.props.mst].name}{getMstDo()}</span>);
                show.push(getRec.bind(this)());
                mstSuccess?this.context.playerStateChange({hp:-enermyDmg}):null;
            }else{
                var skill = this.context.skill;
                if(skill.blood){
                    // var tar =  SKILL_DATA.blood.target;
                    var buff = SKILL_DATA.blood.buff * this.context.getMaxState('hp');
                    this.context.playerStateChange({hp:buff});
                }
                if(skill.absorb){
                    // var tar =  SKILL_DATA.absorb.target;
                    var buff = SKILL_DATA.absorb.buff * this.context.getMaxState('san');
                    this.context.playerStateChange({san:buff});
                }
                this.handleReward();
            }
            this.context.showMsg(<p key = {'atk_'+this.step}>{show}</p>);

            //弹药使用
            var bullet = ITEM_DATA[weapon].bullet;
            if(bullet)this.context.useItem(o(bullet,1));
        }
    },
    handleRun:function(){
        // this.context.setStateFromChildren({msgList:[]});
        this.step ++ ;
        var mst = this.props.mst;
        var enermyDmg = this.getMstDamage(MST_DATA[mst].damage);
        var timeNeed = this.battleTurnTime;
        this.context.useTime(callBack.bind(this),timeNeed);
        function callBack(){
            var chance = this.getRunChance();
            if(Math.random() < chance){
                this.context.callWindow(null);
            }else{
                this.context.playerStateChange({hp:-enermyDmg});
                var show = <p key = {'run_'+this.step}>逃跑失败！你收到了<span style = {{color:COLOR.RED}}>{enermyDmg}</span>点伤害！</p>;
                this.context.showMsg(show);
            }
        }
    },
    handleReward:function(){
        var skill = this.context.skill;
        var maxHp = MST_DATA[this.props.mst].maxHp;


        var luckyLevel = (skill.lucky||0)*SKILL_DATA.lucky.buff;

        // this.context.setStateFromChildren({msgList:[]});
        //处理怪物掉落
        var placeName = this.props.placeName;
        if(placeName){
            var saveData = this.context.placeSaveData;
            saveData[placeName].mst[this.props.mst].amount --;
            this.context.setStateFromChildren({placeSaveData:saveData});
        }
        //获得宝物
        var rewardList = cloneMul(MST_DATA[this.props.mst].reward,luckyLevel + 1);

        //前缀对掉宝的加成
        var prefix = this.props.prefix;
        var mul = 1 + 0.45 * getLength(prefix);
        for(var attr in rewardList){
            rewardList[attr] = Math.round(rewardList[attr] * mul);
        }

        //一定几率得到的宝物
        var chanceGet = MST_DATA[this.props.mst].chanceGet;
        for(var attr in chanceGet){
            var chance = chanceGet[attr];
            if(Math.random()<chance){
                if(rewardList[attr]){
                    rewardList[attr] += 1;
                }else{
                    rewardList[attr] = 1;
                }
            }
        }

        var wind = this.props.winScene?this.props.winScene:(
                <div>
                    <RegisterComponent willUnmount = {this.props.onWin} itemList = {rewardList}/>
                </div>
                );

        //没有奖励的情况
        // if(getLength(rewardList) == 0){
            // this.props.onWin?this.props.onWin():null;

        // }
        this.context.callWindow(wind);
    },
    render:function(){
        var mstName = this.props.mst;
        var playerHp = this.context.playerState['hp'].amount;
        var mst = this.context.mstState;
        return  <div className = "battleField">
                    <BattleCharactorComponent name = '你' maxHp = {this.context.getMaxState('hp')} currentHp = {playerHp}/>
                    &nbsp;<span className="vs">vs</span>&nbsp;
                    <BattleCharactorComponent  name = {mst.name} maxHp = {mst.maxHp} currentHp = {mst.hp} prefix = {this.props.prefix}/>
                    <BattleChoiceComponent getRequire = {this.getRequire} getRunChance = {this.getRunChance} getChance = {this.getChance} handleAttack = {this.handleAttack} handleRun = {this.handleRun} getDamage = {this.getPlayerDamage} mstDmg = {this.getMstDamage(this.context.mstState.damage)}/>
                    <MsgBox/>
                </div>
    }
});
var DungeonComponent = React.createClass({
    contextTypes:{
        callWindow          :React.PropTypes.func.isRequired,
        dungeonSaveData     :React.PropTypes.object.isRequired,
        setStateFromChildren:React.PropTypes.func.isRequired,
        changeMsg           :React.PropTypes.func.isRequired,
        useTime             :React.PropTypes.func.isRequired,
        useItem             :React.PropTypes.func.isRequired,
        boxSaveData         :React.PropTypes.object.isRequired,
        currentEquip        :React.PropTypes.object.isRequired,
        playerStateUse      :React.PropTypes.func.isRequired,
        setDueling          :React.PropTypes.func.isRequired,
        settings            :React.PropTypes.object.isRequired,
        time                :React.PropTypes.object.isRequired,
        setTitle            :React.PropTypes.func.isRequired,
    },
    choices:{
        search:{
            name:'探索'
        },
        sneak:{
            name:'潜行'
        },
        downStair:{
            name:'下楼'
        },
    },
    getInitialState:function(){
        var dungeonSaveData = this.context.dungeonSaveData;
        var deepest = dungeonSaveData.deepest;
        return{
            ropeGoTo:deepest,
        }
    },
    componentWillMount:function(){
        this.context.setTitle('地牢');
    },
    getReward:function(stairCount){
        //获得宝箱奖励
        var rewardLevel = Math.ceil(stairCount/10);
        var list = [];
        for (var i = rewardLevel; i > 0; i--) {
            var arr = DUNGEON_DATA[i] && DUNGEON_DATA[i].reward;
            if(!arr)continue;
            for (var j = arr.length - 1; j >= 0; j--) {
                list.push(arr[j]);
            };
        };
        //每层都能获得之前层的宝物。
        var result = {};
        while(getLength(result) == 0){
            for(var i = 0; i < list.length; i++){
                var tmp = list[i];
                var chance = tmp.chance;
                var things = tmp.things;
                for(var attr_2 in things){
                    for (var j = things[attr_2] - 1; j >= 0; j--) {
                        if(Math.random() < chance){
                            if(result[attr_2]){
                                result[attr_2] += 1;
                            }else{
                                result[attr_2] = 1;
                            }
                        }
                    };
                }
            }
        }
        return result;
    },
    discoverInc:function(amount){
        //增加某一层的探索度
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        if(dungeonSaveData.stairData[stairCount]){
            dungeonSaveData.stairData[stairCount] += amount;
        }else{
            dungeonSaveData.stairData[stairCount] = amount;
        }
        this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
    },
    getNewRoom:function(choice){
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        var boxSaveData = this.context.boxSaveData;
        dungeonSaveData.roomCount += 1;
        var room;
        var rewardChance = this.getRewardChance(choice);
        if(Math.random() < rewardChance){
            room = 'reward';
        }else{
            do{
                room = getRandomThing({
                    'empty' :5,
                    'home'  :1,
                    'seller':2,
                    'getKey':2,
                    'useKey':2,
                    'trap'  :1,
                }).attr;
            }while((room == 'useKey' && !boxSaveData.bag.things.dungeonKey)||(room == 'getKey' && boxSaveData.bag.things.dungeonKey))
        }
        //探索度惩罚
        room = ((Math.random() < ((dungeonSaveData.stairData[stairCount] || 0)/MAX_DISCOVER))) ? (boxSaveData.bag.things.dungeonKey?'empty':'getKey') : room;

        //清除目前的room
        dungeonSaveData.room = {
            desc:null,
        }
        this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});

        setTimeout(function(){
            switch(room){
                case 'seller':
                var trade = getRandom(TRADE_DATA,{haveValue:['type','dungeon']}).attr;
                dungeonSaveData.room = {
                    desc:<TradeComponent canBack = {false} trade = {trade}/>,
                }
                break;
                case 'getKey':
                dungeonSaveData.room = {
                    desc:<p>你发现了一把钥匙。</p>,
                    itemList:{dungeonKey:1},
                }
                break;
                case 'reward':
                dungeonSaveData.room = {
                    desc:<p>你发现了一个[宝箱]</p>,
                    itemList:this.getReward(dungeonSaveData.stairCount),
                }
                this.discoverInc(1);
                break;
                case 'home':
                var handleClick = function(){
                    this.context.useTime(function(){
                        this.context.setStateFromChildren({currentScene:'home'});
                    }.bind(this),2);
                }
                dungeonSaveData.room = {
                    desc:<div>
                            <p>一个古老的传送装置。</p>
                            <p>要回家吗？</p>
                            <p><BtnComponent desc = '回家' handleClick = {handleClick.bind(this)}/></p>
                        </div>,
                }
                break;
                case 'empty':
                dungeonSaveData.room = {
                    desc:<p>这个房间空空如也。</p>,
                }
                break;
                case 'useKey':
                var handleGet = function(){
                    this.context.useTime(function(){
                        this.discoverInc(1);
                        var dungeonSaveData = this.context.dungeonSaveData;
                        var get = this.getReward(dungeonSaveData.stairCount);
                        get = cloneMul(get,2);
                        this.context.useItem({dungeonKey:1},'bag');
                        dungeonSaveData.room.itemList = get;
                        dungeonSaveData.room.desc = null;
                        this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
                    }.bind(this),1);
                }
                dungeonSaveData.room = {
                    desc:(
                        <div>
                            <p>你发现了一个上锁的宝箱，你决定...</p>
                            <p><BtnComponent desc = '使用钥匙' handleClick = {handleGet.bind(this)}/></p>
                        </div>
                        )
                }
                break;
                case 'trap':
                var itemGet = getRandomThing({
                    'gem':200,
                    'gold':200,
                }).attr;
                var handleClick = function(){
                    this.context.useTime(function(){
                        this.discoverInc(1);
                        var damagedChance = 0.5;
                        var getDamaged = Math.random() < damagedChance;
                        var damage = Math.ceil(Math.random() * Math.floor((1 - Math.pow(0.9,this.context.dungeonSaveData.stairCount)) * 100));
                        var amount = Math.ceil(Math.pow(this.context.dungeonSaveData.stairCount,0.2) + 1);
                        if(getDamaged){
                            this.context.playerStateUse({hp:damage});
                        }
                        dungeonSaveData.room.desc = (
                                                        <div>
                                                            {getDamaged?<p>你踩到了<span style = {{color:COLOR.RED}}>陷阱</span>！受到了<span style = {{color:COLOR.RED}}>{damage}</span>点伤害!</p>:null}
                                                            <RegisterComponent canBack = {false} itemList = {o(itemGet,amount)}/>
                                                        </div>
                                                    );
                        this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
                    }.bind(this),0.2);
                }
                dungeonSaveData.room = {
                    desc:<div>
                            <p>你发现了远处闪闪发亮的<span style = {{color:COLOR.YELLOW}}>[{ITEM_DATA[itemGet].name}]</span>，但可能是一个陷阱。你决定...</p>
                            <BtnComponent desc = '捡取' handleClick = {handleClick.bind(this)}/>
                        </div>
                }
                break;
            }
            this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
        }.bind(this),0);
    },
    getNewStair:function(stairNum){
        var dungeonSaveData = this.context.dungeonSaveData;
        //最深层
        dungeonSaveData.stairCount = stairNum ? stairNum : dungeonSaveData.stairCount + 1;
        dungeonSaveData.deepest = dungeonSaveData.stairCount > dungeonSaveData.deepest ? dungeonSaveData.stairCount : dungeonSaveData.deepest;
        dungeonSaveData.roomCount = 0;
        this.getNewRoom();
    },
    getRewardChance:function(choice){
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        var rewardChance = this.rewardChance[choice];
        var currentEquip = this.context.currentEquip;
        var mul = 1;
        for(var attr in currentEquip){
            if(!currentEquip[attr])continue;
            if(ITEM_DATA[currentEquip[attr]].rewardChanceMul){
                mul *= ITEM_DATA[currentEquip[attr]].rewardChanceMul;
            }
        }
        //探索度惩罚
        return  (1 - (1 - rewardChance)*mul) * (1 - (dungeonSaveData.stairData[stairCount] || 0)/MAX_DISCOVER);
    },
    getBattleChance:function(choice){
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        var battleChance = this.battleChance[choice];
        var currentEquip = this.context.currentEquip;
        var mul = 1;
        for(var attr in currentEquip){
            if(!currentEquip[attr])continue;
            if(ITEM_DATA[currentEquip[attr]].battleChanceMul){
                mul *= ITEM_DATA[currentEquip[attr]].battleChanceMul;
            }
        }
        //探索度惩罚
        return  (1 - (1 - battleChance)*mul) * (1 - (dungeonSaveData.stairData[stairCount] || 0)/MAX_DISCOVER);
    },
    //不同行动的不同结果的几率
    battleChance:{
        search:0.6,
        sneak:0.1,
    },
    rewardChance:{
        search:0.4,
        sneak:0.3,
    },
    stepTime:2,
    handleChoice:function(choice){
        this.context.setDueling(false);
        var dungeonSaveData = this.context.dungeonSaveData;
        var useTime = this.context.useTime;
        var timeNeed = this.stepTime;
        function getDungeonBattle(){
            var step = 10;
            var enermyLevel = Math.ceil(this.context.dungeonSaveData.stairCount/step);

            //作者还没更新的层
            var i = enermyLevel;
            var isUpper = Math.random() < UPPER_CHANCE;
            if(isUpper)i ++;
            do{
                var mstList = DUNGEON_DATA[i] && DUNGEON_DATA[i].mst;
                i --;
            }while(!mstList);

            var mst = getRandomThing(mstList).attr;
            var prefixChance = (this.context.dungeonSaveData.stairCount%step)/step;
            var prefix = {};
            var time = Math.floor(Math.random() * prefixChance * 5);

            var o = clone(PREFIX_DATA);
            delete o.upper;
            if(isUpper){
                time --;
                prefix.upper = true;
            }
            for(var i = time; i > 0; i --){
                prefix[getRandom(o).attr] = true;
            }

            var wind = <BattleComponent mst = {mst} prefix = {prefix} onWin = {this.discoverInc.bind(null,1)}/>
            this.context.callWindow(wind);
        }
        switch(choice){
            case 'search':
            case 'sneak':
            var chance = this.getBattleChance(choice);
            var callBack = function(){
                if(Math.random() < chance){
                    getDungeonBattle.bind(this)();
                }
                this.getNewRoom(choice);
            }.bind(this);
            break;
            case 'downStair':
            this.context.useItem({'dungeonKey':1},'bag');
            var callBack = function(){
                this.getNewStair();
            }.bind(this);
            break;
            case 'dungeonRope':
            this.context.useItem({'dungeonRope':1},'bag');
            var dungeonSaveData = this.context.dungeonSaveData;
            var callBack = function(){
                this.getNewStair(dungeonSaveData.deepest -1);
            }.bind(this);
            break;
        }
        useTime((function(){
            callBack();
            this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
        }).bind(this),timeNeed);
    },
    showChoiceMsg:function(choice){
        var changeMsg = this.context.changeMsg;
        switch(choice){
            case 'search':
            case 'sneak':
                var chance = this.getBattleChance(choice);
                var chance_2 = this.getRewardChance(choice);
                var detailedList = [
                    <span key = '1'>你有(<span style = {{color:COLOR.GREEN}}>{Math.round(chance_2*100)}%</span>)的几率获得宝物。</span>,
                    <span key = '2'>你有(<span style = {{color:COLOR.RED}}>{Math.round(chance*100)}%</span>)的几率遇到敌人。</span>
                ];
                break;
            case 'downStair':
                var detailedList = [<span key = '1'>进入下一层。</span>];
                break;
            case 'dungeonRope':
                var detailedList = [<span key = '1'>你可以穿越到第({this.context.dungeonSaveData.deepest})层之前的任意层。</span>];
                break;
        }
        var detailType = 'desc';
        changeMsg(detailedList,detailType);
    },
    onWinGoHome:function(){
        this.context.useTime(function(){
            this.context.setStateFromChildren({currentScene:'home'});
        }.bind(this),1)
    },
    //游戏结束
    onGameEndDisplay:function(){
        var account = this.context.settings.account;
        var time = this.context.time;
        var jsonStr = 'action=end&day='+time.day+'&account='+account;
        $('#upload')[0].onclick = null;
        htmlobj = $.ajax({contentType:"application/x-www-form-urlencoded",type:'POST',url:SAVE_URL,async:true,data:jsonStr,success:function(){
            this.handleBoard(htmlobj.responseText);
        }});
    },
    handleBoard:function(d){
        eval('var data = '+d+';');
        function getTds(dataRow){
            var result = []
            for (var j = 1; j < dataRow.length; j++) {
                result.push(<td key = {j}>dataRow[j]</td>)
            }
            return result;
        }
        function getRows(){
            var result = [];
            for (var i = data.length - 1; i >= 0; i--) {
                result.push(<tr key = {i}>{getTds(data[i])}</tr>);
            };
        }
        var board = (
            <div>
                <p>所有通关的英雄们：</p>
                <div style="overflow:auto;"  className="buildTable tableOuter">
                    <table style="overflow:auto;" className="table table-condensed table-hover table-striped table-bordered">
                        <thead>
                            <td>英雄大名</td>
                            <td>存活时间</td>
                            <td>通关时间</td>
                        </thead>
                        {getRows.bind(this)()}
                    </table>
                </div>
            </div>
            );
    },
    onWin:function(){
        var time = this.context.time;
        var day = time.day;
        var account = this.context.settings.save_account;
        var wind  = <div>
                        <p>恭喜你到达了地牢的底端，你已经征服了这个游戏</p>
                        <p>你存活了:<span className="num">{day}</span>天</p>
                        <p>现在你可以将你的大名写在石碑上：</p>
                        <div className = "form-control">{account}</div>
                        <div><BtnComponent className = "btn btn-default"  id = "upload" handleClick = {this.onGameEndDisplay}>铭刻</BtnComponent></div>
                    </div>
        this.context.callWindow(wind);
    },
    handleRopeGo:function(){
        var dungeonSaveData = this.context.dungeonSaveData;
        var deepest = dungeonSaveData.deepest;
        var ropeGoTo = this.state.ropeGoTo;
        var ropeGoFrom = dungeonSaveData.stairCount;
        var time = Math.pow(Math.abs(ropeGoTo - ropeGoFrom),0.7);
        time = (time >= 20)?20:time;
        this.context.useItem({'dungeonRope':1},'bag');
        this.context.useTime(function(){
            dungeonSaveData.stairCount = ropeGoTo;
            dungeonSaveData.roomCount = 1;
            dungeonSaveData.room = {
                        desc:<p>你顺利的空降到了指定的地点。</p>
                    };
            this.setState({ropeWindow:false});
            this.context.setStateFromChildren({dungeonSaveData:dungeonSaveData});
        }.bind(this),time);
    },
    handleRope:function(){
        this.setState({ropeWindow:!this.state.ropeWindow});
    },
    checkRopeDisable:function(){
        var value = this.state.ropeGoTo;
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        var deepest = dungeonSaveData.deepest;
        return (value > deepest)||(value < stairCount + 1);
    },
    handleRopeChange:function(sender){
        var obj = sender.nativeEvent.srcElement ? sender.nativeEvent.srcElement : sender.nativeEvent.target;
        // var value =  parseInt($('.scheduleInput_'+this.props.type)[0].value);
        var value =  parseInt(obj.value);
        var dungeonSaveData = this.context.dungeonSaveData;
        var stairCount = dungeonSaveData.stairCount;
        var deepest = dungeonSaveData.deepest;
        value = value>deepest?deepest:value;
        value = value<stairCount+1?stairCount+1:value;
        this.setState({ropeGoTo:value});
    },
    render:function(){
        var dungeonSaveData = this.context.dungeonSaveData;
        var boxSaveData = this.context.boxSaveData;
        function getChoices(){
            var result = [];
            for(var attr in this.choices){
                var tmp = this.choices[attr];
                //判断能否下楼
                if(attr == 'downStair' && !boxSaveData.bag.things['dungeonKey'])continue;
                result.push(
                        <div key = {attr}>
                            <BtnComponent handleMouseEnter = {this.showChoiceMsg.bind(this,attr)} handleClick = {this.handleChoice.bind(this,attr)}>{tmp.name}</BtnComponent>
                        </div>
                    )
            }
            if(boxSaveData.bag.things['dungeonRope'] && dungeonSaveData.stairCount < dungeonSaveData.deepest -1){
                result.push(
                        <div key = 'dungeonRope'>
                            <BtnComponent handleMouseEnter = {this.showChoiceMsg.bind(this,'dungeonRope')} handleClick = {this.handleRope}>穿洞</BtnComponent>
                        </div>
                    )
            }
            return <div className = "well dungeonChoice">{result}</div>;
        }
        function getRoomDesc(){
            var room = dungeonSaveData.room;
            //到达底端
            return  <div style = {{marginTop:20,width:300,margin:'auto'}}>
                        <div style = {{display:this.state.ropeWindow?'none':'block'}}>
                            {room.desc}
                            {(getLength(dungeonSaveData.room.itemList))?<RegisterComponent canBack = {false} itemList = {dungeonSaveData.room.itemList} />:null}
                        </div>
                        {this.state.ropeWindow?(
                            <div style = {{marginTop:10,border:'1px solid #ddd'}}>
                                <p>--到达层--</p>
                                <div><ProgressComponent key = 'ropeGo' current = {dungeonSaveData.stairData[this.state.ropeGoTo] || 0} max = {MAX_DISCOVER}/></div>
                                <input className = 'form-control rope' type = 'number'  onChange = {this.handleRopeChange} value = {this.state.ropeGoTo}/>
                                <div>
                                    <BtnComponent disabled = {this.checkRopeDisable()} desc = '前往' handleClick = {this.handleRopeGo}/>
                                </div>
                            </div>):null}
                    </div>
        };
        return(
                <div style = {{margin:'auto',width:400,height:300}}>
                <div className = "dungeonHeading">
                    <p>第 <span className="num">{dungeonSaveData.stairCount}</span> 层</p>
                    <p>房间 <span className="num">{dungeonSaveData.roomCount}</span> </p>
                    <p>最深记录: <span className="num">{dungeonSaveData.deepest}</span> </p>
                    <div><ProgressComponent key = 'view' current = {dungeonSaveData.stairData[dungeonSaveData.stairCount] || 0} max = {MAX_DISCOVER}/></div>
                </div>
                <div>
                    {getRoomDesc.bind(this)()}
                    {getChoices.bind(this)()}
                </div>
                </div>
         )
    }
});

//==>the outer view of game
//逻辑层
var AdvanComponent = React.createClass({
    getDefaultProps:function(){
        return{
            misk:0,
            progress:0,
        }
    },
    getInitialState: function(){
        return {
            title:'冒险',
            wind:null,
            buildingSaveData:null
        }
    },
    contextTypes:{
        time        : React.PropTypes.object.isRequired,
        currentScene: React.PropTypes.string.isRequired,
        season      : React.PropTypes.string.isRequired,
        generation  : React.PropTypes.number.isRequired,
    },
    childContextTypes:{
        setTitle  : React.PropTypes.func.isRequired,
    },
    getChildContext: function() {
        return {
            setTitle:this.setTitle,
        };
    },
    setTitle:function(name){
        this.setState({title:name});
    },
    getScene: function(name){
        var sceneMap = {
            home:<HomeComponent/>,
            branch:<BranchComponent/>,
            dungeon:<DungeonComponent/>,
        }
        var result = sceneMap[name];
        if(!result){
            result = <PlaceComponent place = {name}/>;
        }
        return result;
    },
    render: function() {
        function getTimeDiplay(time){
            var str = "";
            var hour = Math.floor(time);
            if(hour < 2){
                str += "半夜";
            }else{
                if(hour < 5){
                    str += "凌晨";
                }else{
                    if(hour < 10){
                        str += "早晨";
                    }else{
                        if(hour < 13){
                            str += "中午";
                        }else{
                            if(hour < 17){
                                str += "下午";
                            }else{
                                if(hour < 19){
                                    str += "傍晚";
                                }else{
                                    if(hour < 22){
                                        str += "晚上";
                                    }else{
                                        str += "深夜";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return str;
        };
        function getDisplay(){
            if(this.props.children == null){
                return <div className = "advan" id = "advan">{this.getScene(this.context.currentScene)}</div>
            }else{
                return this.props.children
            }
        };
        function getColor(num){
            var str = "";
            var time = Math.abs(12-num);
            var r,g,b;
            if(time < 2){
                r = 255;
                g = 255;
                b = 255;
            }else{
                if(time < 4){
                    r = Math.floor((2 - time)*(255-102)/2 + 255);
                    g = Math.floor((2 - time)*(255-153)/2 + 255);
                    b = Math.floor((2 - time)*(255-204)/2 + 255);
                }else{
                    if(time < 7){
                        r = Math.floor((6 - time)*(102-66)/4 + 102);
                        g = Math.floor((6 - time)*(153-21)/4 + 153);
                        b = Math.floor((6 - time)*(204-0)/4 + 204);
                    }else{
                        if(time < 8){
                            r = Math.floor((9 - time)*(66-0)/3 + 66);
                            g = Math.floor((9 - time)*(21-0)/3 + 21);
                            b = Math.floor((9 - time)*(0-0)/3 + 0);
                        }
                        else{
                            r = 0;
                            g = 0;
                            b = 0;
                        }
                    }
                }
            }
            str += "rgb(";
            str += r;
            str += ",";
            str += g;
            str += ",";
            str += b;
            str += ")";
            return str;
        }
        var misk = this.props.misk;
        var time = this.context.time;
        var progress = this.props.progress;
        var seasonDescMap = {
            'spring':<span className = 'season' style = {{color:COLOR.GREEN}}>春</span>,
            'summer':<span className = 'season' style = {{color:COLOR.RED}}>夏</span>,
            'autumn':<span className = 'season' style = {{color:COLOR.YELLOW}}>秋</span>,
            'winter':<span className = 'season' style = {{color:COLOR.BLUE}}>冬</span>,
        }
        return <div className="panel panel-primary advanMain" >
                <div className="panel-heading">
                    <div className = "time" id = "time">
                        {this.context.generation?<span>-轮回{this.context.generation}-</span>:null}
                        {seasonDescMap[this.context.season]}第<span className = "date">{time.day}</span>日 {getTimeDiplay(time.hour)}
                        <div style = {{backgroundColor:getColor(time.hour)}} className = "weatherBox"></div>
                    </div>
                    <span> : </span>
                    <div className="title">{this.state.title}</div>
                </div>
                <div className="panel-body  clearFix">
                    <div className = "mask" style={{display:misk==0?'none':'block',opacity:misk}}>
                        <div className = "waitBar" style={{display:(misk==0||progress==0)?'none':'block',opacity:misk}}>
                            <div className="waitBarIn" style = {{width:Math.ceil(100*progress)}}></div>
                        </div>
                    </div>
                    <div className = 'advanOuter' >
                        <div className = "advan">
                            {getDisplay.bind(this)()}
                        </div>
                    </div>
                </div>
                <StateComponent/>
            </div>
    }
});
var MainComponent = React.createClass({
    startSeason:'',//游戏开始时的季节
    getInitialState:function(){
        if(localStorage.getItem('autoSave')==null||localStorage.getItem('autoSave')==''){
            localStorage.setItem('autoSave',false);
        }
        if(localStorage.getItem('sort')==null||localStorage.getItem('sort')==''){
            localStorage.setItem('sort',false);
        }
        var startSeason = Math.random() > 0.5?'spring':'autumn';
        var state = {
            boxSaveData     :clone(BOX_INIT),
            buildingSaveData:clone(BUILDING_INIT),
            coolDownSaveData:clone(COOL_DOWN_INIT),
            currentBox      :'',
            currentEquip    :{body:null,hand:null,foot:null,head:null},
            currentScene    :'home',
            defaultWeapon   :[],
            detailedItem    :'',
            detailedList    :[],
            detailedType    :'',
            dungeonSaveData :{stairCount:1,roomCount:1,deepest:1,stairData:{}},
            durableSaveData :clone(DURABLE_INIT),
            robberSaveData  :clone(ROBBER_INIT),
            eventSaveData   :clone(EVENT_INIT),
            isDueling       :false,
            menuDesc        :{},
            menuHint        :0,
            misk            :0,
            msgList         :[],
            mstState        :{},//怪物的状态
            placeSaveData   :clone(PLACE_INIT),
            playerState     :clone(PLAYER_STATE_INIT),
            progress        :0,
            startSeason     :startSeason,
            season          :startSeason,
            showMenu        :'',
            skill           :{},
            time            :{day:1,hour:6},
            tradeSaveData   :clone(TRADE_INIT),
            settings        :{sort:localStorage.getItem('sort').bool(),autoSave:localStorage.getItem('autoSave').bool()},
            wind            :null,
            maouLevel       :0,
            campSaveData    :{
                choice:null,
                picked:false,
            },
            generation      :0,
        }
        if(MODE=='DEBUG'){
            state.skill = DEBUG_SKILL;
        }
        var saveData = clone(state);
        state.saveData = saveData;
        //加载保存的存档
        if(localStorage.getItem('number')==null||localStorage.getItem('number')==''){
            localStorage.setItem('number',1);
        }
        state = extend(state,(localStorage.getItem('saveData'+localStorage.getItem('number'))==null||localStorage.getItem('saveData'+localStorage.getItem('number'))=='')?null:JSON.parse(localStorage.getItem('saveData'+localStorage.getItem('number'))));
        return state;
    },
    childContextTypes:{
        maouLevel            : React.PropTypes.number.isRequired,
        parentState          : React.PropTypes.object.isRequired,
        AudioEngine          : React.PropTypes.object.isRequired,
        boxSaveData          : React.PropTypes.object.isRequired,
        buildingSaveData     : React.PropTypes.object.isRequired,
        cancelEquip          : React.PropTypes.func.isRequired,
        changeItem           : React.PropTypes.func.isRequired,
        changeMsg            : React.PropTypes.func.isRequired,
        checkFull            : React.PropTypes.func.isRequired,
        checkHaveResource    : React.PropTypes.func.isRequired,
        checkHaveResourceAll : React.PropTypes.func.isRequired,
        currentEquip         : React.PropTypes.object.isRequired,
        currentScene         : React.PropTypes.string.isRequired,
        defaultWeapon        : React.PropTypes.array.isRequired,
        detailedItem         : React.PropTypes.string.isRequired,
        detailedList         : React.PropTypes.array.isRequired,
        detailedType         : React.PropTypes.string.isRequired,
        dungeonSaveData      : React.PropTypes.object.isRequired,
        durableSaveData      : React.PropTypes.object.isRequired,
        eventSaveData        : React.PropTypes.object.isRequired,
        getBuildingLevel     : React.PropTypes.func.isRequired,
        getMaxDurable        : React.PropTypes.func.isRequired,
        getMaxTimeOfRequire  : React.PropTypes.func.isRequired,
        getMstCircle         : React.PropTypes.func.isRequired,
        getScienceLevel      : React.PropTypes.func.isRequired,
        getTempDesc          : React.PropTypes.func.isRequired,
        getTheMaxTimeToUse   : React.PropTypes.func.isRequired,
        getValue             : React.PropTypes.func.isRequired,
        getcoolDownSaveData  : React.PropTypes.func.isRequired,
        getTimeNeed          : React.PropTypes.func.isRequired,
        handleDeath          : React.PropTypes.func.isRequired,
        handleExchange       : React.PropTypes.func.isRequired,
        isDueling            : React.PropTypes.bool.isRequired,
        menuDesc             : React.PropTypes.object.isRequired,
        menuHint             : React.PropTypes.number.isRequired,
        msgList              : React.PropTypes.array.isRequired,
        mstState             : React.PropTypes.object.isRequired,
        mstStateChange       : React.PropTypes.func.isRequired,
        placeSaveData        : React.PropTypes.object.isRequired,
        playerState          : React.PropTypes.object.isRequired,
        playerStateChange    : React.PropTypes.func.isRequired,
        playerStateUse       : React.PropTypes.func.isRequired,
        season               : React.PropTypes.string.isRequired,
        startSeason          : React.PropTypes.string.isRequired,
        setCurrentBox        : React.PropTypes.func.isRequired,
        setCurrentScene      : React.PropTypes.func.isRequired,
        setDueling           : React.PropTypes.func.isRequired,
        setStateFromChildren : React.PropTypes.func.isRequired,
        setcoolDownSaveData  : React.PropTypes.func.isRequired,
        showMenu             : React.PropTypes.string.isRequired,
        showMsg              : React.PropTypes.func.isRequired,
        skill                : React.PropTypes.object.isRequired,
        time                 : React.PropTypes.object.isRequired,
        tradeSaveData        : React.PropTypes.array.isRequired,
        useItem              : React.PropTypes.func.isRequired,
        useItemThatPlayerHave: React.PropTypes.func.isRequired,
        useTime              : React.PropTypes.func.isRequired,
        upload               : React.PropTypes.func.isRequired,
        download             : React.PropTypes.func.isRequired,
        settings             : React.PropTypes.object.isRequired,
        setVolume            : React.PropTypes.func.isRequired,
        callWindow           : React.PropTypes.func.isRequired,
        campSaveData         : React.PropTypes.object.isRequired,
        robberSaveData       : React.PropTypes.object.isRequired,
        handleItemClick      : React.PropTypes.func.isRequired,
        getEnveronmentTemperature: React.PropTypes.func.isRequired,
        currentBox           : React.PropTypes.string.isRequired,
        sort                 : React.PropTypes.func.isRequired,
        getMaxState          : React.PropTypes.func.isRequired,
        reBorn               : React.PropTypes.func.isRequired,
        generation           : React.PropTypes.number.isRequired,
    },
    getChildContext: function() {
        return {
            generation          : this.state.generation,
            reBorn              : this.reBorn,
            maouLevel           : this.state.maouLevel,
            sort                : this.sort,
            currentBox          : this.state.currentBox,
            parentState         : this.state,
            AudioEngine         : this.AudioEngine,
            boxSaveData         : this.state.boxSaveData,
            buildingSaveData    : this.state.buildingSaveData,
            cancelEquip         : this.cancelEquip,
            changeItem          : this.changeItem,
            changeMsg           : this.changeMsg,
            checkFull           : this.checkFull,
            checkHaveResource   : this.checkHaveResource,
            checkHaveResourceAll: this.checkHaveResourceAll,
            currentEquip        : this.state.currentEquip,
            currentScene        : this.state.currentScene,
            defaultWeapon       : this.state.defaultWeapon,
            detailedItem        : this.state.detailedItem,
            detailedList        : this.state.detailedList,
            detailedType        : this.state.detailedType,
            dungeonSaveData     : this.state.dungeonSaveData,
            durableSaveData     : this.state.durableSaveData,
            eventSaveData       : this.state.eventSaveData,
            getBuildingLevel    : this.getBuildingLevel,
            getMaxDurable       : this.getMaxDurable,
            getMaxTimeOfRequire : this.getMaxTimeOfRequire,
            getMstCircle        : this.getMstCircle,
            getScienceLevel     : this.getScienceLevel,
            getTempDesc         : this.getTempDesc,
            getTheMaxTimeToUse  : this.getTheMaxTimeToUse,
            getValue            : this.getValue,
            getcoolDownSaveData : this.getcoolDownSaveData,
            getTimeNeed         : this.getTimeNeed,
            handleDeath         : this.handleDeath,
            handleExchange      : this.handleExchange,
            isDueling           : this.state.isDueling,
            menuDesc            : this.state.menuDesc,
            menuHint            : this.state.menuHint,
            msgList             : this.state.msgList,
            mstState            : this.state.mstState,
            mstStateChange      : this.mstStateChange,
            placeSaveData       : this.state.placeSaveData,
            playerState         : this.state.playerState,
            playerStateChange   : this.playerStateChange,
            playerStateUse      : this.playerStateUse,
            season              : this.state.season,
            startSeason         : this.state.startSeason,
            setCurrentBox       : this.setCurrentBox,
            setCurrentScene     : this.setCurrentScene,
            setDueling          : this.setDueling,
            setStateFromChildren: this.setStateFromChildren,
            setcoolDownSaveData : this.setcoolDownSaveData,
            showMenu            : this.state.showMenu,
            showMsg             : this.showMsg,
            skill               : this.state.skill,
            time                : this.state.time,
            tradeSaveData       : this.state.tradeSaveData,
            useItem             : this.useItem,
            useItemThatPlayerHave: this.useItemThatPlayerHave,
            useTime             : this.useTime,
            upload              : this.upload,
            download            : this.download,
            settings            : this.state.settings,
            setVolume           : this.setVolume,
            callWindow          : this.callWindow,
            campSaveData        : this.state.campSaveData,
            handleItemClick     : this.handleItemClick,
            getEnveronmentTemperature:this.getEnveronmentTemperature,
            robberSaveData      : this.state.robberSaveData,
            getMaxState         : this.getMaxState,
        };
    },
    reBorn:function(skill){
        var skillNow = clone(this.state.skill);
        for(var attr in skillNow){
            // if(!SKILL_DATA[attr].isTalent)delete skillNow[attr];
            if(!SKILL_DATA[attr].isTalent)skillNow[attr] = (Math.round(skillNow[attr]/10));
            if(skillNow[attr] == 0){
                delete skillNow[attr];
            }
        }
        skillNow[skill] = (skillNow[skill]||0) + 1;
        var generation = this.state.generation + 1;
        var state = this.getInitialState();
        state.skill = skillNow;
        state.generation = generation;
        this.setState(state);
        setTimeout(function(){
            for(var attr in this.state.playerState){
                if(attr == 'temp')continue;
                this.playerStateChange(o(attr,1000000));
            }
        }.bind(this),0);
    },
    getMaxState:function(type){
        var skill = this.state.skill;
        var buff = 0;
        switch(type){
            case 'ps':
            case 'san':
                buff += skill.durable?SKILL_DATA.durable.buff * skill.durable:0;
                break;
            case 'hp':
            case 'full':
            case 'moist':
                buff += skill.physique?SKILL_DATA.physique.buff * skill.physique:0;
                break;
            default:
                break;
        }
        var base = MAX_STATE;
        return Math.round(base * (1 + buff));
    },
    sort:function(box){
        var boxSaveData = (this.state.boxSaveData);
        var result = {};
        var source = clone(boxSaveData[box].things);
        var typeList = {};
        do{
            var flag = false;
            for(var attr in source){
                var temp = ITEM_DATA[attr];
                if(temp.type && typeList[temp.type] == undefined){
                    typeList[temp.type] = true;
                    flag = true;
                }
            }
        }while(flag == true)

        for(var type in typeList){
            for(var attr in source){
                var temp = ITEM_DATA[attr];
                if(temp.type == type){
                    result[attr] = source[attr];
                }
            }
        }
        boxSaveData[box].things = result;
        this.setState({boxSaveData:boxSaveData});
    },
    handleItemClick:function(item,box){
        //食物、药剂效果
        if(ITEM_DATA[item].effect){
            this.playerStateChange(ITEM_DATA[item].effect);
            this.useItem(o(item,1),box);
            //play effect
            var type = ITEM_DATA[item].type;
            switch(type){
                case 'food':
                case 'cooked':
                if(ITEM_DATA[item].isDrink){
                    this.AudioEngine.playEffect('drink');
                    break;
                }
                this.AudioEngine.playEffect('eat');
                break;
                case 'poizon':
                this.AudioEngine.playEffect('drink');
                break;
            }
        }

        //回城卷轴
        if(item == 'scroll'){
            if(getLength(this.state.mstState) != 0){
                this.showMsg(<p key = {Math.random()} >你不能在战斗中进行传送！</p>)
            }else{
                this.useItem({scroll:1},box);
                this.useTime(function(){
                    var dungeonSaveData = this.state.dungeonSaveData;
                    dungeonSaveData.stairCount = 1;
                    dungeonSaveData.roomCount = 1;
                    this.setState({currentScene:'home',dungeonSaveData:dungeonSaveData,wind:null});
                }.bind(this),0.3);
                this.AudioEngine.playEffect(item.sound || 'pick');
            }
        }
        //能量球
        var durableRec = ITEM_DATA[item].durableRec;
        if(durableRec){
            var durableSaveData = this.state.durableSaveData;
            this.useItem(o(item,1),box);
            this.useTime(function(){
                for(var attr in durableSaveData){
                    var wt = ITEM_DATA[attr].weaponType;
                    if(wt == durableRec || (durableRec == 'unmagic' && (wt == 'melee'||wt == 'shoot'))){
                        // var max = ITEM_DATA[attr].durable;
                        // var rec = Math.round(max * (ITEM_DATA[item].durableAmount || 1));
                        // durableSaveData[attr] -= rec;
                        // if(durableSaveData[attr] < 0)
                        durableSaveData[attr] = 0;
                    }
                }
                this.setState({durableSaveData:durableSaveData});
            }.bind(this),0.3);
            this.AudioEngine.playEffect(item.sound || 'pick');
        }
        if(box == 'bag' && ITEM_DATA[item].equipType){
            if(getLength(this.state.mstState) != 0){
                this.showMsg(<p key = {Math.random()} >你不能在战斗中更改装备！</p>)
            }else{
                var equipType = ITEM_DATA[item].equipType;
                var currentEquip = clone(this.state.currentEquip);
                if(currentEquip[equipType] == item){
                    currentEquip[equipType] = null;
                }else{
                    currentEquip[equipType] = item;
                }
                this.setStateFromChildren({currentEquip:currentEquip});
                this.AudioEngine.playEffect('wear');
            }
        }
        //能力提升物品
        if(ITEM_DATA[item].type == 'special'){
            var play = ITEM_DATA[item].isDrink?'drink':'scroll';
            this.AudioEngine.playEffect(play);
            this.setState({menuHint:this.state.menuHint+1});
            var upgrade = ITEM_DATA[item].upgrade;
            var skill = this.state.skill;
            if(skill[upgrade]){
                skill[upgrade] ++;
            }else{
                skill[upgrade] = 1;
            }
            this.setState({skill:skill});
            this.useItem(o(item,1),box);
        }
    },
    getTimeNeed:function(placeName){
        //获得装备的速度加成
        var buff = 1;
        var currentEquip = this.state.currentEquip;
        for(var attr in currentEquip){
            var equip = currentEquip[attr];
            if(!equip)continue;
            if(ITEM_DATA[equip].moveFaster)buff *= ITEM_DATA[equip].moveFaster;
        }
        var timeNeed = PLACE_DATA[placeName].timeNeed * buff;
        return timeNeed;
    },
    callWindow:function(wind){
        this.setState({wind:wind});
    },
    AudioEngine:{
        on:true,
        playEffect:function(name){
            if(!this.on)return;
            var tar = document.getElementById('effect_'+name);
            tar.play();
            if(tar.currentTime>0.01)tar.currentTime = 0;
        },
        clearBg:function(name){
            var list = document.getElementsByTagName('audio');
            for (var i = list.length - 1; i >= 0; i--) {
                if(list[i].id.lastIndexOf('bg')==-1 || list[i].id == 'bg_'+name)continue;
                list[i].pause();
            };
        },
        playBg:function(name){
            if(!this.on)return;
            this.clearBg(name);
            var tar = document.getElementById('bg_'+name);
            if(!tar)return false;
            tar.play();
        },
        stopBg:function(name){
            var tar = document.getElementById('bg_'+name);
            if(!tar)return false;
            tar.pause();
        },
    },
    showMsg:function(msg){
        var msgList = this.state.msgList;
        msgList.push(msg);
        this.setState({msgList:msgList});
        setTimeout((function(){
            var msgList = this.state.msgList;
            if(msgList.length==0)return;
            msgList.splice(0,1);
            this.setState({msgList:msgList});
        }).bind(this),MSG_TIME)
    },
    getValue:function(give){
        if(ITEM_DATA[give].value)return ITEM_DATA[give].value;
        var value = 0;
        if(ITEM_DATA[give].effect){
            for(var attr in ITEM_DATA[give].effect){
                var mul = 1;
                if(attr == 'ps')mul *= 0.5;
                value += mul * (((ITEM_DATA[give].effect[attr] > 0) && (attr != 'temp'))?ITEM_DATA[give].effect[attr]:0);
            }
        }else{
            var done = false;
            function check(data){
                if(data[give]){
                    var require = data[give].require;
                    for(var attr in require){
                        value += this.getValue(attr) * require[attr];
                        done = true;
                    }
                    return true;
                }
                return false;
            }
            if(!check.bind(this,MAKE_DATA)()){
                if(!check.bind(this,ALCHEMY_DATA)()){
                    if(!check.bind(this,MAGIC_DATA)()){
                    }
                }
            }
        }
        return value;
    },
    setDueling:function(value){
        this.setState({isDueling:value});
    },
    getScienceLevel:function(type){
        var buildingSaveData = this.state.buildingSaveData;
        var boxSaveData = this.state.boxSaveData;
        var count = 0;
        for (var attr in boxSaveData['scienceTable'].things){
            if(ITEM_DATA[attr].type == type){
                count ++;
            }
        }
        return count;
    },
    getBuildingLevel:function(update){
        var updateBox = this.state.boxSaveData[update].things;
        var count = 0;
        for(var attr in updateBox){
            count ++;
        }
        return count;
    },
    setCurrentBox:function(value){
        this.setState({currentBox:value})
    },
    setCurrentScene:function(value){
        this.setState({currentScene:value})
    },
    getcoolDownSaveData:function(attr){
        var coolDownSaveData = this.state.coolDownSaveData;
        return coolDownSaveData[attr];
    },
    setcoolDownSaveData:function(attr,value){
        var coolDownSaveData = this.state.coolDownSaveData;
        coolDownSaveData[attr] = value;
        this.setState({
            coolDownSaveData:coolDownSaveData
        })
    },
    mstStateChange:function(list,isNegative){
        var o = this.state.mstState;
        for (var attr in list){
            var stateName = attr,amount = list[attr];
            if(o[stateName]==undefined)continue;
            o[stateName] += isNegative? -amount:amount;
        }
        this.setState({mstState:o});
    },
    getMstCircle:function(amount,balancedAmount,speed){
        var still = 0.1;//最少增长量
        var c = speed || 1;//曲线陡峭系数
        if(amount>balancedAmount)return 0;
        if(amount>balancedAmount*0.5)return c*(balancedAmount - amount)/balancedAmount;
        return still + c*amount/balancedAmount;
    },
    setStateFromChildren:function(obj,isAdding){
        if(isAdding){
            for(var attr in obj){
                obj[attr] += this.state[attr];
            }
        }
        this.setState(obj);
    },
    getMaxTimeOfRequire:function(require){
        //仅用于家内物品最大制造个数的判断
        var req = {};
        for(var attr in require){
            req[attr]= require[attr];
        }
        for(var i = 0;;i++){
            if(!this.checkHaveResourceAll(req,true))break;
            for(var attr in require){
                req[attr] += require[attr];
            }
        }
        return i;
    },
    useItemThatPlayerHave:function(require){
        //可以使用大箱子里的资源
        var boxSaveData = this.state.boxSaveData;
        var bag = boxSaveData.bag.things;
        var bigBox = boxSaveData.bigBox.things;
        for(var attr in require){
            if(bag[attr]){
                if(bag[attr] > require[attr]){
                    bag[attr] -= require[attr];
                }else{
                    if(bigBox[attr]){
                        bigBox[attr] -= require[attr] - bag[attr];
                    }
                    delete bag[attr];
                }
            }else{
                bigBox[attr] -= require[attr];
            }
            if(bigBox[attr] == 0){
                delete bigBox[attr];
            };
            if(bag[attr] == 0){
                delete bag[attr];
            };
        }

    },
    getItemThatPlayerHave:function(){
        //可以使用大箱子里的资源
    },

    checkFull:function(box,itemName){
        if(typeof box == 'string'){
            box = this.state.boxSaveData[box];
        }
        return (box.size <= getLength(box.things) && !box.things[itemName]);
    },
    getTheMaxTimeToUse:function(){
        //这个检查函数是为了防止出现使用时间导致饥饿和水分不足而死亡的情况。。
        var fullTime = Math.floor(this.state.playerState.full.amount/FULL_DESC_PER_HOUR - 0.0001);
        var moistTime =  Math.floor(this.state.playerState.moist.amount/MOIST_DESC_PER_HOUR - 0.0001);
        return moistTime > fullTime?fullTime:moistTime;
    },
    cancelEquip:function(itemName){
        //卸下装备
        var equipType = ITEM_DATA[itemName].equipType;
        if(equipType){
            var currentEquip = (this.state.currentEquip);
            if(currentEquip[equipType] != itemName)return;
            currentEquip[equipType] = null;
            this.setState({currentEquip:currentEquip});
        }
    },
    handleExchange:function(itemName,box,onlyOne){
        var fromBox = box,toBox;
        if(box == 'bag'){
            if(this.state.currentBox == '')return;
            toBox = this.state.currentBox;
        }else{
            toBox = 'bag';
        }
        if(this.checkFull(this.state.boxSaveData[toBox],itemName))return 'box is full!';

        var amount = this.state.boxSaveData[fromBox].things[itemName];

        if(CTRL_PRESSED || SHIFT_PRESSED){
            var max_num = SHIFT_PRESSED?100:10;
            if(amount > max_num){
                amount = max_num;
            }
        }else{
            if(onlyOne){
                amount = 1;
            }
        }
        var o = {};
        o[itemName] = -Math.ceil(amount);
        this.changeItem(o,fromBox);
        o[itemName] = Math.ceil(amount);
        this.changeItem(o,toBox);
        this.cancelEquip(itemName);
        this.AudioEngine.playEffect('exchange');

        if(this.state.settings.sort)this.sort('bag');
    },
    changeItem:function(items,box,isNegative){
        var boxSaveData = this.state.boxSaveData;
        var tar = boxSaveData[box].things;
        for (var attr in items) {
            if(boxSaveData[box].things[attr]){
                tar[attr] += isNegative?-items[attr]:items[attr];
            }else{
                tar[attr] = items[attr];
            }
            if(tar[attr] <= 0 || isNaN(tar[attr]))delete tar[attr];
        };
        this.setState({boxSaveData:boxSaveData});
    },
    useItem:function(items,box){
        var box = box || 'bag';
        var o = {};
        for (var attr in items) {
            o[attr] = -items[attr];
        }
        this.changeItem(o,box);
    },
    clickUse:function(item,box){
        var type = ITEM_DATA[item].type;
        switch(type){
            case 'food':
            case 'cooked':
            case 'poizon':
            var effect = type.effect;
        }
    },
    getEnveronmentTemperature:function(day){
        var season = this.getSeason(day);
        var seasonMap = {
            'spring':0,
            'summer':1,
            'autumn':2,
            'winter':3,
        };
        var base = seasonMap[this.state.startSeason]* SEASON_CIRCLE - SEASON_CIRCLE/2 ;
        var temperature = (Math.sin(Math.PI*(day+base)/(2*SEASON_CIRCLE)));
        temperature = 50 * (temperature > 0?1:-1) * Math.pow(temperature,4);

        return temperature;
    },
    getSeason:function(day){
        var startSeason = this.state.startSeason;
        var seasonNumber = Math.floor(day / SEASON_CIRCLE)%4;
        var seasonMap = {
            0:'spring',
            1:'summer',
            2:'autumn',
            3:'winter',
        };
        for (var i in seasonMap) {
            if (seasonMap[i] == startSeason){
                var offset = i;
            }
        };
        var index = (parseInt(offset) + seasonNumber)%4;
        return seasonMap[index];
    },
    handleDayOver:function(day){
        var skill = this.state.skill
        //经营手腕等级
        var manageLevel = (skill.manage || 0) * SKILL_DATA.manage.buff;

        var placeSaveData = this.state.placeSaveData;
        var boxSaveData = this.state.boxSaveData;
        var buildingSaveData = this.state.buildingSaveData;
        var season = this.state.season;
        function setInc(tar,speed) {
            tar.count += speed;
            var incAmount = Math.floor(tar.count);
            tar.amount += incAmount;
            tar.count -= incAmount;
        }

        for(var place in placeSaveData){
            //set new creature
            for(var mstAttr in placeSaveData[place].mst){
                var mst = placeSaveData[place].mst[mstAttr];
                var speed = this.getMstCircle(mst.amount, PLACE_DATA[place].mst[mstAttr].balancedAmount);
                setInc(mst,speed);
            }
            //set resources
            for(var resourceAttr in placeSaveData[place].resource){
                var resource = placeSaveData[place].resource[resourceAttr];
                var spd = PLACE_DATA[place].resource[resourceAttr].circle;
                var speed = this.getMstCircle(resource.amount, PLACE_DATA[place].resource[resourceAttr].initAmount,spd);
                if(season == 'spring')speed *= 5;
                if(season == 'autumn')speed *= 0.5;
                if(season == 'winter')speed *= 0;

                setInc(resource,speed);
            }
        }
        this.setState({placeSaveData:placeSaveData});

        //set marshGasTank
        for(var attr in boxSaveData.marshGasTank.things){
            boxSaveData.marshGasTank.things[attr] -= 1;
            if(!boxSaveData.marshGasTank.things[attr])delete boxSaveData.marshGasTank.things[attr];
            boxSaveData.marshGasTank.things.fertilizer = (boxSaveData.marshGasTank.things.fertilizer || 0) + 1 + manageLevel;
        }

        //set well
        var haveWell = this.state.buildingSaveData.well.own;
        if(haveWell){
            var level = this.getBuildingLevel('wellUpdate');
            var o = {water:level+3};
            o = cloneMul(o,manageLevel + 1);
            this.changeItem(o,'well');
        }
        //set trap
        var haveTrap = this.state.buildingSaveData.trap.own;
        if(haveTrap){
            var list = this.state.buildingSaveData.trap.list;
            for(var i = 0;i < list.length;i++ ){

                var tmp = list[i];
                if(tmp.succeed)continue;
                var data = TRAP_DATA[tmp.type];
                var chance = data.chance;
                var level = this.getScienceLevel('trapChance');
                chance *= 1 + 0.5 * level;
                if(Math.random() < chance){
                    tmp.itemGet = getRandom(data.itemGet).attr;
                    tmp.itemAmount = data.itemGet[tmp.itemGet];
                    tmp.succeed = true;

                    //提示
                    buildingSaveData['trap'].hint = true;
                }
            }
        }

        //set trade
        var step = boxSaveData.scienceTable.things['beacon']?1:2;
        var timeMul = boxSaveData.scienceTable.things['beacon_2']?2:1;
        if(day%step == 0){
            var tradeSaveData = this.state.tradeSaveData;
            for(var i = 0; i < timeMul; i++){
                do{
                    var trade = getRandom(TRADE_DATA,{noAttr:'type'}).attr;
                }while((TRADE_DATA[trade].season && TRADE_DATA[trade].season != season) || (TRADE_DATA[trade].day && this.state.time.day < TRADE_DATA[trade].day));
                var time = TRADE_DATA[trade].time;
                tradeSaveData.push({trade:trade,time:time})
            }
            this.setState({tradeSaveData:tradeSaveData});
        }
        //set season
        this.setState({season:this.getSeason(day)});
        this.setState({buildingSaveData:buildingSaveData});

        //set dungeon
        var dungeonSaveData = this.state.dungeonSaveData;
        var stairCount = 1;
        for(var attr in dungeonSaveData.stairData){
            if(parseInt(stairCount)< parseInt(attr))stairCount = attr;
        }
        while(stairCount > 0){
            dungeonSaveData.stairData[stairCount] = (dungeonSaveData.stairData[stairCount] || 0) - DUNGEON_DEC;
            if(dungeonSaveData.stairData[stairCount] < 0)dungeonSaveData.stairData[stairCount] = 0;
            stairCount --;
        }
        this.setState({dungeonSaveData:dungeonSaveData});

        //set robber
        var robberSaveData = this.state.robberSaveData;
        var level = this.getScienceLevel('lockUpdate');
        var securityBox = this.getScienceLevel('securityBox');
        var stoledPersont = STOLE * Math.pow(0.9,securityBox);

        var deadLine = ROBBER_DAY + (MODE == 'DEBUG'?0:level) + Math.random()*3 - Math.random()*3;
        if(day - robberSaveData.lastDate > deadLine){
            robberSaveData.lastDate = day;
            //防盗
            var  buildingSaveData = this.state.buildingSaveData;
            var trapList = buildingSaveData.trap.list;
            var flag = false;
            if(this.state.currentScene != 'home'){
                for(var i = 0; i < trapList.length;i++){
                    if(trapList[i].succeed)continue;
                    if(trapList[i].type == 'antiRogue'){
                        trapList[i].succeed = true;
                        var get = getRandom(TRAP_DATA.antiRogue.itemGet).attr;
                        trapList[i].itemGet = get;
                        trapList[i].itemAmount = TRAP_DATA.antiRogue.itemGet[get];
                        buildingSaveData['trap'].hint = true;
                        flag = true;
                        break;
                    }
                }
                if(flag == false){
                    var get = {};
                    addTo(get,stole.bind(this,'bigBox')());
                    addTo(get,stole.bind(this,'cooker')());
                    addTo(get,stole.bind(this,'well')());
                    addTo(get,stole.bind(this,'marshGasTank')());
                    addTo(robberSaveData.stoled,get);
                    if(robberSaveData.stoledAll == undefined){
                        robberSaveData.stoledAll = {};
                    }
                    addTo(robberSaveData.stoledAll,get);
                }
            }
        }
        this.setState({robberSaveData:robberSaveData});

        function stole(box){
            var get = {};
            var length = getLength(boxSaveData[box].things);
            length = Math.ceil(length * STOLE_CHANCE);
            var stoleList = {};
            while(length > 0){
                do{
                    var random = getRandom(boxSaveData[box].things).attr;
                }
                while(stoleList[attr]);
                stoleList[attr] = boxSaveData[box].things[attr];
                length --;
            }
            for(var attr in boxSaveData[box].things){
                if(
                    (ITEM_DATA[attr].type == 'food') || (ITEM_DATA[attr].type == 'cooked') || (ITEM_DATA[attr].type == 'met') 
                    ){
                    var amount = boxSaveData[box].things[attr];

                    var stoleAmount = Math.round(stoledPersont * Math.sqrt(amount) * (0.5 + Math.random()));

                    var o = {};
                    o[attr] = stoleAmount;
                    if(stoleAmount){
                        addTo(get,o);
                    }
                }
            }
            this.changeItem(get,box,true);
            return get;
        }
    },
    //TimeManager
    isInNight:function(time){
        return (time < NIGHT_END || time > NIGHT_BEGIN);
    },
    getTimeInNight:function(from,to) {
        var timeInNight = 0;
        var i = from;
        while (1) {
            if(this.isInNight(i%24))timeInNight += 0.1;
            if(i > to)break;
            i+=0.1;
        };
        return timeInNight;
    },
    handleDeath:function(type){
        var reason = '';
        switch(type){
            case'frozen':
            reason = '寒冷';
            break;
            case'hunger':
            reason = '饥荒';
            break;
            case'thirsty':
            reason = '脱水';
            break;
            case'health':
            reason = '失血过多';
            break;
        }
        var desc = (
                <div style = {{margin:100}}>
                    <p className='ddcg' style = {{color:'#74AB6A',display:'none'}}>🔥读档成功,请稍后...🔥</p>
                    <p className='ddsb' style = {{color:'red',display:'none'}}>🤐当前存档为空🤐</p>
                    <p className='ck' style = {{color:'#B25242',display:'none'}}>存档重开中,请等待页面刷新~</p>
                    <p>你死了！</p>
                    <p>死因：{reason}</p>
                    <BtnComponent handleClick = {this.download.bind(null)}>读档</BtnComponent>
                    <BtnComponent handleClick = {this.init}>重新开始</BtnComponent>
                </div>
            )
        this.setState({
            menuDesc:desc,
            showMenu:'custom',
        });
    },
    checkDeath:function(){
        if(MODE == 'DEBUG')return;
        var playerState = (this.state.playerState);
        if(playerState.hp.amount <= 0){
            if(playerState.ps.amount == 0 && (this.getTempDesc() == 'cold' ||  this.getTempDesc() == 'veryCold')){
                this.handleDeath('frozen');
            }
            this.handleDeath('health');
        }
        if(playerState.full.amount <= 0){
            this.handleDeath('hunger');
        }
        if(playerState.moist.amount <= 0){
            this.handleDeath('thirsty');
        }
    },
    addTime:function(timeNeed,props){

        var skill = this.state.skill;
        var manageLevel = (skill.manage || 0) * SKILL_DATA.manage.buff;

        var season = this.state.season;
        var currentEquip = this.state.currentEquip;

        var now = this.state.time.hour;
        var to = now + timeNeed;
        var timeInNight = this.getTimeInNight(now,to);
        now += timeNeed;
        var day = this.state.time.day;
        while(now >= 24){
            now = now - 24;
            this.handleDayOver(day);
            day += 1;
        }
        var playerState = clone(this.state.playerState);

        //装备
        var tempDownBuff = [];
        var tempUpBuff = [];
        var tempBuff = 0;
        for(var attr in currentEquip){
            if(currentEquip[attr]){
                //体温变化修正
                tempBuff += ITEM_DATA[currentEquip[attr]].tempBuff || 0;
                if(ITEM_DATA[currentEquip[attr]].tempDownMul)tempDownBuff.push(ITEM_DATA[currentEquip[attr]].tempDownMul);
                if(ITEM_DATA[currentEquip[attr]].tempUpMul)tempUpBuff.push(ITEM_DATA[currentEquip[attr]].tempUpMul);

                //恢复累物品
                var rec = currentEquip[attr] && ITEM_DATA[currentEquip[attr]].rec;
                if(rec){
                    for(var attr in rec){
                        playerState[attr].amount += timeNeed * rec[attr];
                        var max = this.getMaxState(attr);
                        if(playerState[attr].amount > max)playerState[attr].amount = max;
                    }
                }

            }
        }

        //set temperature
        var tempMul = 2;
        var temp = (props && props.temp)||this.getEnveronmentTemperature(day);

        temp += tempBuff;
        if(PLACE_DATA[this.state.currentScene] && PLACE_DATA[this.state.currentScene].temp)temp += PLACE_DATA[this.state.currentScene].temp;
        var playerTemp = this.state.playerState['temp'].amount;
        var tempChange = (temp > playerTemp)?timeNeed:-timeNeed;
        tempChange = tempChange * tempMul;


        var oldPlayerTemp = playerTemp;

        //建筑影响
        // if(this.state.currentScene == 'home' && this.state.buildingSaveData.)

        if(tempChange<0){
            for (var i = tempDownBuff.length - 1; i >= 0; i--) {
                tempChange *= tempDownBuff[i];
            };
        }
        if(tempChange>0){
            for (var i = tempUpBuff.length - 1; i >= 0; i--) {
                tempChange *= tempUpBuff[i];
            };
        }


        playerState.temp.amount += tempChange/2;

        //防止矫枉过正
        if((tempChange > 0) == (playerState.temp.amount > temp))playerState.temp.amount = temp;

        //set temp influences
        if(playerState.temp.amount < -20){
            playerState.ps.amount -= Math.ceil(timeNeed * (-20 - playerState.temp.amount) /10);
        }
        if(playerState.ps.amount < 0){
            playerState.hp.amount += playerState.ps.amount;
            playerState.ps.amount = 0;
        }
        if(playerState.temp.amount > 20){
            playerState.moist.amount -= Math.ceil(timeNeed * (playerState.temp.amount - 20) /10);
        }

        playerState.temp.amount += tempChange/2;

        //防止矫枉过正
        if((tempChange > 0) == (playerState.temp.amount > temp))playerState.temp.amount = temp;

        //set full and moist
        playerState.full.amount -= FULL_DESC_PER_HOUR * timeNeed;
        playerState.moist.amount -= MOIST_DESC_PER_HOUR * timeNeed;
        //set san dec
        if(this.state.currentScene != 'home'){
            playerState.san.amount -= SAN_DESC_PER_HOUR * timeInNight;
        }
        var stateCurrentSum = 0;
        var stateSum = 0;
        for(var attr in playerState){
            var max = this.getMaxState(attr);
            if(attr == 'temp'){
                stateCurrentSum += max - 2*Math.abs(playerState.temp.amount)
            }else{
                stateCurrentSum += playerState[attr].amount;
            }
            stateSum += max;
        }

        var totalState = stateCurrentSum/stateSum;
        playerState.san.amount += (totalState - 0.7) * this.getMaxState('san') / MAX_STATE;

        var sanMax = this.getMaxState('san');
        playerState.san.amount = playerState.san.amount>sanMax?sanMax:playerState.san.amount;
        playerState.san.amount = playerState.san.amount<0?0:playerState.san.amount;
        //set cool down
        var coolDown = this.state.coolDownSaveData;
        for(var attr in coolDown){
            coolDown[attr] -= timeNeed;
            coolDown[attr] = coolDown[attr]>0?coolDown[attr]:0;
        }
        //set date hour
        this.setState({
            time:{day:day,hour:now},
            coolDownSaveData:coolDown,
        });
        //set duel people
        var trade = this.state.tradeSaveData;
        for(var i = 0; i < trade.length ; i++){
            trade[i].time -= timeNeed;
            if(trade[i].time<0){
                trade.splice(i,1);
            }
        }
        this.setState({tradeSaveData:trade});
        //set wait make buildings
        var buildingSaveData = this.state.buildingSaveData;
        function addToAll(building){
            var list = buildingSaveData[building].list;
            var map = {
                'farm':CROP_DATA,
                'alco':ALCO_DATA,
            }
            var attachData = map[building];
            if(season == 'winter' && (building == 'alco' || building == 'farm'))return false;

            for (var i = list.length - 1; i >= 0; i--) {
                //生产
                list[i].timeNow += timeNeed;

                //春季产出翻倍
                if(season == 'spring' && (building == 'farm'))list[i].timeNow += timeNeed;
                
                //成熟提醒
                var timeMax = attachData[list[i].type].timeMax/(1 + manageLevel);
                if(list[i].timeNow > timeMax){
                    buildingSaveData[building].hint = true;
                }
            };
        }
        addToAll.bind(this,'farm')();
        addToAll.bind(this,'alco')();
        this.setState({buildingSaveData:buildingSaveData});
        //finally setState
        this.setState({playerState:playerState});

        //检查死亡
        this.checkDeath();
        return true;
    },
    playerStateChange:function(list,isNegative){
        var o = this.state.playerState;
        for (var attr in list){
            var stateName = attr,amount = list[attr];
            if(o[stateName] == undefined)continue;
            o[stateName].amount += isNegative? -amount:amount;
            var max = this.getMaxState(stateName);
            (o[stateName].amount > max)?o[stateName].amount = max:null;
        }
        if(o.san.amount < 0)o.san.amount = 0;
        this.setState({playerState:o});
        //检查死亡
        this.checkDeath();
    },
    playerStateUse:function(list,isNegative){
        this.playerStateChange(list,!(isNegative||false));
        this.durableChange(list);
    },
    getMaxDurable:function  (item) {
        var durable = ITEM_DATA[item].durable;
        var weaponType = ITEM_DATA[item].weaponType;
        var level = weaponType == 'melee' ? this.getScienceLevel('durableUpdate') : this.getScienceLevel('magicDurableUpdate');
        return Math.round(durable * (1 + level * 0.25));
    },
    durableChange:function(list,isNegative){
        var o = this.state.durableSaveData;
        for (var attr in list){
            var itemName = attr,amount = list[attr];
            if(o[itemName]==undefined)continue;
            o[itemName] += isNegative? -amount:amount;
            if(o[itemName] >= this.getMaxDurable(itemName)){
                o[itemName] = 0;
                var use = {};use[itemName] = 1;
                this.useItem(use,'bag');
            }
        }
        this.setState({durableSaveData:o});
    },
    getTempDesc:function(){
        var playerState = this.state.playerState;
        var state = playerState.temp;
        if(state.amount>30)return 'veryHot';
        if(state.amount>20)return 'hot';
        if(state.amount>10)return 'warm';
        if(state.amount>0)return 'nice';
        if(state.amount>-10)return 'nice';
        if(state.amount>-20)return 'cool';
        if(state.amount>-30)return 'cold';
        return 'veryCold';
    },
    useTime:function(callBack,timeNeed,props){
        if(timeNeed == 0){
            callBack();
            return;
        }
        var delay = timeNeed * DELAY_MUL;
        if(delay > 5000){
            delay = 5000 + Math.log(2,(delay - 5000));
        }
        var min = MIX_DELAY;
        delay = delay>min?delay:min;
        var miskChangeTime = ((delay*0.25)<(min*0.4))?(delay*0.25):(min*0.4);
        this.setMisk(miskChangeTime);

        var doCallBack = function(){
            callBack();
            this.clearMisk(miskChangeTime);
            this.addTime(timeNeed,props);
        }.bind(this);
        if(delay >= 500){
            this.setProgress(delay,doCallBack);
        }else{
            setTimeout(doCallBack, delay);
        }
    },
    setProgress:function(delay,callBack){
        var progress = 0;
        var foo = bindAnimation(
                function(step){
                    progress += step/delay;
                    this.setState({progress:progress});
                    if(progress >= 1){
                        callBack();
                        this.setState({progress:0});
                    }else{
                        requestAnimationFrame(foo);
                    }
                }.bind(this)
            )()
        requestAnimationFrame(foo);
    },
    setMisk:function(delay){
        var step = 100;
        var misk = 0;
        var foo = bindAnimation(
                function(step){
                    misk += step/delay;
                    this.setState({misk:misk});
                    if(misk >= 1){
                        this.setState({misk:1})
                    }else{
                        requestAnimationFrame(foo);
                    }
                }.bind(this)
            )()
        requestAnimationFrame(foo);
    },
    clearMisk:function(delay){
        var step = 100;
        var misk = 1;
        var foo = bindAnimation(
                function(step){
                    misk -= step/delay;
                    this.setState({misk:misk});
                    if(misk <= 0){
                        this.setState({misk:0})
                    }else{
                        requestAnimationFrame(foo);
                    }
                }.bind(this)
            )()
        requestAnimationFrame(foo);
    },
    checkHaveResource:function(resName,resAmount,bag){
        // check form bagData to stateData
        // 多用型的检查
        var state = this.state.playerState;
        if(bag[resName] && bag[resName] >= resAmount)return true;
        if(state[resName] && state[resName].amount >= resAmount)return true;
        return false;
    },
    checkHaveResourceAll:function(resList,haveBox){
        var flag = true;

        //获得背包与大箱子的所有资源
        if(haveBox){
            var bag = together(this.state.boxSaveData.bag.things,this.state.boxSaveData.bigBox.things);
        }else{
            var bag = clone(this.state.boxSaveData.bag.things);
        }

        for (var attr in resList) {
            flag = flag && this.checkHaveResource(attr,resList[attr],bag);
        };
        return flag;
    },
    changeMsg:function(name,type){
        if(type == 'desc'){
            this.setState({detailedList:name,detailedType:type});
        }else{
            this.setState({detailedItem:name,detailedType:type});
        }
    },
    preventDefault:function(event){
         event.preventDefault();
    },
    render:function() {
        return  <div className = "main clearFix"  onContextMenu = {this.preventDefault} onSelect = {this.preventDefault}>
                    <MenuComponent type = {this.state.showMenu}/>
                    <AdvanComponent misk = {this.state.misk} progress = {this.state.progress}>{this.state.wind}</AdvanComponent>
                    <BagComponent items = {this.state.boxSaveData.bag.things} size = {this.state.boxSaveData.bag.size} />

                </div>;
    },
    componentWillMount:function(){
        if(this.state.saveData==null){
            this.init();
        }
    },
    init:function(){
        var initState = this.getInitialState();
        this.setState(initState);
    },
    setVolume:function (argument) {
        this.AudioEngine.on = !this.AudioEngine.on;
        render();
    },
    loadState:function(data){
        this.setState({currentScene:'home'});
        //对存档的预处理
        data.misk = 0;
        data.progress = 0;
        data.wind = null;
        data.detailedItem = '';
        data.detailedType = '';
        data.detailedList = [];
        data.currentBox = '';

        if(!data.generation){
            data.generation = 0;
        }
        if(!data.maouLevel){
            data.maouLevel = 0;
        }
        if(!data.robberSaveData){
            data.robberSaveData = ROBBER_INIT;
        }
        if(data.dungeonSaveData.stairData == undefined){
            data.dungeonSaveData.stairData = {};
        }
        //补丁
        for(var attr in BOX_INIT){
            if(!data.boxSaveData[attr]){
                data.boxSaveData[attr] = clone(BOX_INIT[attr]);
            }
        }
        //新地图资源
        for(var place in PLACE_DATA){
            if(data.placeSaveData[place] == undefined){
                data.placeSaveData[place] = clone(PLACE_INIT[place]);
            }else{
                //资源补丁
                for(var attr in PLACE_INIT[place].resource){
                    if(!data.placeSaveData[place].resource[attr]){
                        data.placeSaveData[place].resource[attr] = clone(PLACE_INIT[place].resource[attr]);
                    }
                }
                for(var attr in data.placeSaveData[place].resource){
                    //清除资料片中不存在的资源
                    for(var res in data.placeSaveData[place].resource){
                        if(PLACE_DATA[place].resource[res] == undefined){
                            delete data.placeSaveData[place].resource[res];
                        }
                    }
                }
                //怪物补丁
                for(var attr in PLACE_INIT[place].mst){
                    if(!data.placeSaveData[place].mst[attr]){
                        data.placeSaveData[place].mst[attr] = clone(PLACE_INIT[place].mst[attr]);
                    }
                }
                for(var attr in data.placeSaveData[place].mst){
                    //清除资料片中不存在的怪兽
                    for(var mst in data.placeSaveData[place].mst){
                        if(PLACE_DATA[place].mst[mst] == undefined){
                            delete data.placeSaveData[place].mst[mst];
                        }
                    }
                }

            }
        }
        for(var attr in ITEM_DATA){
            if(ITEM_DATA[attr].durable && data.durableSaveData[attr] == undefined){
                data.durableSaveData[attr] = 0;
            }
        }
        //新事件
        for(var attr in EVENT_INIT){
            if(EVENT_INIT[attr] != undefined && (data.eventSaveData[attr] == undefined)){
                data.eventSaveData[attr] = EVENT_INIT[attr];
            }
        }
        this.setState(data);
        this.setState({showMenu:''});
        this.setState({currentScene:'home'});
        var level = this.getScienceLevel('bagSizeBonus');
        var boxSaveData = this.state.boxSaveData;
        boxSaveData['bag'].size = BAG_BASE_SIZE + level;
        this.setState({boxSaveData:boxSaveData});
    },
    loadData:function (str) {
        this.setState({currentScene:'branch'});
        setTimeout(function(){
            this.setState({currentScene:'home'});
            var data = eval('(' + str + ')');
            //对存档的预处理
            this.loadState(data);
        }.bind(this),100)
    },
    //读档
    download:function(){
        // var saveData = (this.state);
        // var save_account = saveData.settings.save_account;
        // var save_pass = saveData.settings.save_pass;
        // var jsonStr = 'action=load&account=' + save_account + '&pass=' + save_pass + '&data=nope';
        // var self = this;
        var cundang = localStorage.getItem('saveData'+localStorage.getItem('number'));
        if(cundang==null||cundang==''||cundang==undefined){
            $('.ddsb').css('display','block');
            setTimeout(function (){
                $('.ddsb').fadeOut(500);
            }, 2000);
            // alert("该存档为空！读档失败");
        }else{
            var that = this;
            $('.ddcg').css('display','block');
            setTimeout(function (){
                $('.ddcg').fadeOut(500);
                that.setState({saveData:cundang});
                that.loadData(cundang);
            }, 2000);
            // alert("读取成功！");
        }
        // var htmlobj = $.ajax({
        //     contentType:"application/x-www-form-urlencoded",
        //     type:'POST',
        //     url:SAVE_URL,
        //     async:true,
        //     data:jsonStr,
        //     success:function(){
        //         if(htmlobj.responseText=='no account'){
        //             alert("没有这个账号...");
        //             return;
        //         }
        //         if(htmlobj.responseText=='incorrect pass'){
        //             alert("密码错误...");
        //             return;
        //         }
        //         if(htmlobj.responseText=='invalid'){
        //             alert("账号、密码必须是3-12位的数字以及字母的组合...");
        //             return;
        //         }
        //             lll(htmlobj.responseText);
        //             alert("读取成功！");
        //             self.setState({saveData:htmlobj.responseText});
        //             self.loadData(htmlobj.responseText);
        // }});
    },
    //存档
    upload:function(doNotShow){
        var saveData = clone(this.state);
        var save_account = saveData.settings.save_account;
        var save_pass = saveData.settings.save_pass;
        var day = saveData.time.day;
        var g = saveData.generation;
        // if(save_account == null||save_account == ''){
        //     alert('不输入账号怎么保存啊。。。');
        //     return;
        // }
        // if(save_pass == null||save_pass == ''){
        //     alert('不输入密码怎么保存啊。。。');
        //     return;
        // }
        delete saveData.settings;
        delete saveData.saveData;
        delete saveData.wind;
        delete saveData.detailedItem;
        delete saveData.detailedList;
        delete saveData.detailedType;
        // var jsonStr = 'action=save&account=' + save_account + '&pass=' + save_pass + '&data=' + encodeURI(JSON.stringify(saveData)) + '&day=' + day + '&g=' + g;
        localStorage.setItem('saveData'+localStorage.getItem('number'),JSON.stringify(saveData));
        this.setState({saveData:JSON.stringify(saveData)});
        $('.cdcg').css('display','block');
        setTimeout(function (){
            $('.cdcg').fadeOut(500);
        }, 2000);
        // alert("保存成功！");
        // location.reload();
        // var htmlobj = $.ajax({
        //     contentType:"application/x-www-form-urlencoded",
        //     type:'POST',
        //     url:SAVE_URL,
        //     async:true,
        //     data:jsonStr,
        //     success:function(){
        //         if(htmlobj.responseText=='incorrect pass'){
        //             alert("密码错误...");
        //             return;
        //         }
        //         if(htmlobj.responseText=='invalid'){
        //             alert("账号、密码必须是3-12位的数字以及字母的组合...");
        //             return;
        //         }
        //         if(!doNotShow)alert("保存成功！");
        //             // self.setState({saveData:decodeURI(encodeURI(JSON.stringify(saveData)))});
        // }});
    },
});
function render(){
    ReactDOM.render(
        <MainComponent />,
        document.getElementById('game')
    );
}
render();
