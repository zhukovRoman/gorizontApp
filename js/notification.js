;(function(){

    Noty.types = {
        'alert' : 'alert',
        'success' : 'success',
        'error' : "error"
    };
    function Noty (fullContainerId, shortContainerId){
        this.init(fullContainerId, shortContainerId);
        return this;
    };

    Noty.prototype.init = function(fullContainerId, shortContainerId){
        this._notifications = {};
        this._fullContainer = $('#'+fullContainerId);
        this._shortContainer = $('#'+shortContainerId);
    };

    Noty.prototype.changeContainers = function(fullContainerId, shortContainerId){
        this._fullContainer = $('#'+fullContainerId).html('');
        this._shortContainer = $('#'+shortContainerId).html('');
        var noty = this;
        $.each(this._notifications, function(i, n){
            console.log(i)
            noty.show(i)
        })
    };

    Noty.prototype.remove = function(id){
        this.removeFromDOM(id);
        delete this._notifications[id];
        //console.log('remove noty ' + id);
    };

    Noty.prototype.close = function(id){
        var n = this._notifications[id];
        this.removeFromDOM(id);
        if (!n) return;
        if (n.closeable) this.remove(n.id)
        else this.hide(id)
    }

    Noty.prototype.hide = function(id){
        this._notifications[id].status='hide';
        this.show(id);
    }

    Noty.prototype.removeFromDOM = function(id){
        this._fullContainer.children("li#"+id+'.noty').remove();
        this._shortContainer.children("li#"+id).remove();
    }

    Noty.prototype.add = function(text, type, button, timeout, isCloseable ){
        var n = {
            id : "n_"+new Date().getTime(),
            status: 'show',
            text: text,
            type: type,
            button: button,
            closeable: (isCloseable===undefined)? true : isCloseable
        };
        this._notifications[n.id]=n;
        var noty = this;
        if (timeout!=0){
            setTimeout(function(){
              noty.close(n.id);
            },timeout )
        }
        this.show(n.id);
        return n.id;
    };

    Noty.prototype.show = function(id){
        var notify = this._notifications[id];
        //console.log(id)
        if (notify.status=='show') {
            this.showFull(notify);
        }
        else { this.showShort(notify);}
    };

    Noty.prototype.showFull = function(noty){
        var html_obj = $(document.createElement('li')).addClass('noty noty-'+noty.type).attr('id', noty.id);
        html_obj.append($(document.createElement('span')).text(noty.text));
        html_obj.append($(document.createElement('span')).addClass("close-btn").attr('n_id',noty.id));

        if (noty.button){
            html_obj.append($(document.createElement('span')).addClass("noty-btn").text(noty.button.text));
        }
        //console.log(this._fullContainer)
        var n = this;
        this._fullContainer.append(html_obj);
        this._fullContainer.find('#'+noty.id+' .close-btn').click(function(){
            n.close($(this).attr('n_id'));
        })
        if (noty.button){
            this._fullContainer.find('#'+noty.id+' .noty-btn').click(function() {
                n.remove(noty.id)
                noty.button.fn()
            })
        }
    };

    Noty.prototype.showShort = function(noty){
        var html_obj = $(document.createElement('li')).addClass('noty-short noty-'+noty.type).attr('id', noty.id);

        var n = this;
        this._shortContainer.append(html_obj);
        this._shortContainer.children("#"+noty.id).click(function(){
            n.restore(noty.id);
        })

    };

    Noty.prototype.restore = function(id){
        this.removeFromDOM(id);
        this._notifications[id].status='show';
        this.show(id);
    };


    Noty.prototype.getAllNotifications = function(){
        console.log(this._notifications);
    };


    window.Noty = Noty;

}());


gApp.setNotyContainersForMainPage = function(){
    gApp.Noty.changeContainers('notyfication_container','')
}

gApp.setNotyContainersForOtherPages = function(){
    gApp.Noty.changeContainers('notyfication_container_pages','short_notyfication_container')
}


gApp.removeAllUpdateNoty = function () {
    for (var i = 0; i < gApp.Noty.updateNotifications.length; i++){
        gApp.Noty.remove(gApp.Noty.updateNotifications[i])
    }
}




