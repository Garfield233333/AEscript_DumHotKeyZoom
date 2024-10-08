//视图缩放ByGFred 
// v1.2 更新弹出面板
// v1.2.1 更新功能和说明
// v1.2.2 热键配置
//
var myZoomPan = this;
var zoomPan = (function() {
    //Version
    var version = 'v1.2.0';
    //热键配置=====================================
    var userFolder = Folder.userData.fullName + '/Aescripts/DumplingScript';
    var configFile = new File(userFolder + '/DumplingHotKeyZoomConfig.json');
    //按钮
    var obj = {
        HotKeyL: 'z',
        HotKeyR: 'x'
    };
    if (!configFile.exists) { //如果配置不存在
        configFile.open('w');
        var a = configFile.write(JSON.stringify(obj));
        configFile.close();
    }
    if (configFile.exists) { //如果配置为空
        configFile.open('r');
        var a = configFile.read();
        configFile.close();
        if (a == '') {
            configFile.open('w');
            var a = configFile.write(JSON.stringify(obj));
            configFile.close();
        }
    }
    //热键配置END=====================================
    //
    //UI1 Build
    var zoomPan = (myZoomPan instanceof Panel) ? myZoomPan : new Window('palette', 'HotKeyZoom | By GFred', undefined, {
        resizeable: true,
    });
    zoomPan.orientation = 'column';
    zoomPan.spacing = 0;
    zoomPan.margins = 2;
    //=============================================================================

    var gup1 = zoomPan.add('group', undefined, 'Zoom');
    gup1.alignment = ['fill', 'top'];
    gup1.margins = 0;
    var zoomValue = gup1.add('statictext', undefined, undefined);
    zoomValue.preferredSize.width = 45;
    zoomValue.text = 0 + '%';
    var zoomSld = gup1.add('slider', undefined, undefined, 0.015, 16);
    zoomSld.alignment = ['fill', 'center'];
    // zoomSld.preferredSize.height = 20;
    //弹出面板热键
    var newPan = gup1.add('button', undefined, '!');
    newPan.alignment = ['right', 'center'];
    newPan.size = [20, 20];
    newPan.helpTip = 'Builded By GFred\n' + version + '\nHelp: 由于可停靠面板无法识别热键，因此只能对弹出式面板使用热键\n双击/中键点击面板关闭';
    var panA = zoomPan.add('panel', undefined, 'Zoom Tool');
    panA.margins = 10;
    var txt = panA.add('statictext', undefined, '+ / -');
    txt.helpTip = 'A Zoom Tool\nBuilded By GFred\nRead: L-Click/R-Click';
    panA.alignment = ['fill', 'fill'];
    txt.alignment = ['center', 'center'];
    //=============================================================================

    //BG Color
    zoomPan.graphics.backgroundColor = zoomPan.graphics.newBrush(zoomPan.graphics.BrushType.SOLID_COLOR, [0.12, 0.14, 0.14, 1.00])
    panA.graphics.backgroundColor = panA.graphics.newBrush(panA.graphics.BrushType.SOLID_COLOR, [0.20, 0.23, 0.24, 1.00])

    //=============================================================================
    //=============================================================================
    //=============================================================================
    //Function Builded
    //#SmallWin
    var PullPanel = new Window('palette', 'HotKeyPanel | By GFred', undefined, {
        resizeable: true,
        closeButton: 0
    });
    PullPanel.margins = 0;
    PullPanel.onResize = function() {
        PullPanel.layout.resize()
    }
    var smallpan = PullPanel.add('panel');
    smallpan.alignment = ['fill', 'fill'];
    smallpan.size = [80, 80];
    var zoText = smallpan.add('statictext', undefined, '+ / -');
    zoText.alignment = ['center', 'center'];
    zoText.helpTip = 'M-Click: Close\nR-Click: Set HotKey';
    //=============================================================================
    //=============================================================================
    //#HotKeyWin
    var HotKeyWin = new Window('palette', 'HotKey Setting', undefined, {
        resizeable: true,
        closeButton: 0,
    });
    var hotGup = HotKeyWin.add('group', undefined, 'HotKey');
    hotGup.orientation = 'column';
    var aboutHot = hotGup.add('statictext', undefined, 'HotKey:');
    aboutHot.alignment = ['left', 'center'];
    var hotOne = hotGup.add('edittext', undefined, 'z');
    var hotTwo = hotGup.add('edittext', undefined, 'x');
    hotOne.preferredSize.width = hotTwo.preferredSize.width = 120;
    var okBtn = hotGup.add('button', undefined, 'OK');

    //隐藏热键面板
    okBtn.onClick = function() {
        //修改热键配置文件
        configFile.open('w');
        var newObj = {
            HotKeyL: hotOne.text,
            HotKeyR: hotTwo.text
        };
        configFile.write(JSON.stringify(newObj));
        configFile.close();
        HotKeyWin.hide()
    }
    //=============================================================================
    //=============================================================================
    //
    //=============================================================================
    //=============================================================================
    //=============================================================================
    //fun builded
    //！按键
    newPan.addEventListener('mousedown', function(event) {
        if (event.button == 0) {
            PullPanel.frameLocation = [event.screenX + 40, event.screenY - 50];
            PullPanel.show();
            // PullPanel.active;
        }
    })
    PullPanel.addEventListener('keydown', function(event) {
        var k = ScriptUI.environment.keyboardState;
        var kN = k.keyName;
        if (kN == hotOne.text.toUpperCase()) {
            app.activeViewer.views[0].options.zoom -= .05
        }
        if (kN == hotTwo.text.toUpperCase()) {
            app.activeViewer.views[0].options.zoom += .05
        }
    })
    PullPanel.addEventListener('mousedown', function(event) {
        if (event.button == 2) {
            HotKeyWin.frameLocation = [event.screenX - 50, event.screenY - 50];
            HotKeyWin.show();
        }
    })
    //-/+文字面板
    zoText.addEventListener('mousedown', function(event) {
        if (event.button == 1) PullPanel.hide()
    })
    zoText.addEventListener('click', function(event) {
        if (event.detail == 2) {
            PullPanel.hide()
        }
    })
    //缩放函数
    panA.addEventListener('mousedown', function(event) {
        if (event.button == 0) {
            app.activeViewer.views[0].options.zoom += .05;
            zoomSld.value = app.activeViewer.views[0].options.zoom;
            zoomValue.text = (app.activeViewer.views[0].options.zoom * 100).toFixed(0) + '%';
        }
        if (event.button == 2) {
            app.activeViewer.views[0].options.zoom -= .05;
            zoomSld.value = app.activeViewer.views[0].options.zoom;
            zoomValue.text = (app.activeViewer.views[0].options.zoom * 100).toFixed(0) + '%';
        }
    }) zoomSld.onChanging = function() {
        app.activeViewer.views[0].options.zoom = zoomSld.value;
        zoomValue.text = (app.activeViewer.views[0].options.zoom * 100).toFixed(0) + '%';
        // zoomValue.text = app.activeViewer.views[0].options.zoom;
    }
    zoomValue.addEventListener('mousedown', function(event) {
        if (event.button == 0) {
            zoomValue.text = (app.activeViewer.views[0].options.zoom * 100).toFixed(0) + '%'
        }
    })
    //Function Builded END
    //=============================================================================
    //=============================================================================
    //=============================================================================

    zoomPan.layout.layout(true);
    zoomPan.onResizing = zoomPan.onResize = function() {
        zoomPan.layout.resize()
    }

    if (zoomPan instanceof Window) {
        zoomPan.center()
        zoomPan.show()
    }
    return zoomPan;
})()