const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu
const Lang = imports.lang;
const UPower = imports.gi.UPowerGlib;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function ShellSuspendMenuItem() {
  this._init.apply(this, arguments);
}


ShellSuspendMenuItem.prototype = {
  client: new UPower.Client(),
  __proto__: PopupMenu.PopupMenuItem.prototype,
  
  _init: function(metadata, params) {
    let userMenu;
    let children;
    let itemCount;
        
    PopupMenu.PopupMenuItem.prototype._init.call(this, _("Suspend"));
    
    userMenu = Main.panel.statusArea.userMenu;
    itemCount = userMenu.menu._getMenuItems().length;
    
    userMenu.menu.addMenuItem(this, itemCount - 2);
    
    this.connect('activate', Lang.bind(this, function() {
      Main.overview.hide();
      this.client.suspend_sync(null);
    }));
  },
  
  destroy: function() {
    this.actor._delegate = null;
    this.actor.destroy();
    this.actor.emit("destroy");  
  }
};



function ShellHibernateMenuItem() {
  this._init.apply(this, arguments);
}


ShellHibernateMenuItem.prototype = {
  client: new UPower.Client(),
  __proto__: PopupMenu.PopupMenuItem.prototype,
  
  _init: function(metadata, params) {
    let userMenu;
    let children;
    let itemCount;
        
    PopupMenu.PopupMenuItem.prototype._init.call(this, _("Hibernate"));
    
    userMenu = Main.panel.statusArea.userMenu;
    itemCount = userMenu.menu._getMenuItems().length;
    
    userMenu.menu.addMenuItem(this, itemCount - 2);
    
    this.connect('activate', Lang.bind(this, function() {
      Main.overview.hide();
      this.client.hibernate_sync(null);
    }));
  },
  
  destroy: function() {
    this.actor._delegate = null;
    this.actor.destroy();
    this.actor.emit("destroy");  
  }
};




function ShellSuspendOption() {
  this._init();
}

ShellSuspendOption.prototype = {
  client: new UPower.Client(),
  _init: function() {
  
  },
  
  enable: function() {
    if(this.client.get_can_hibernate()) {
      this.hibernatemenuitem = new ShellHibernateMenuItem();
    }
    
    if(this.client.get_can_suspend()) {
      this.suspendmenuitem = new ShellSuspendMenuItem();
      this.handler_id = this.client.connect("changed", Lang.bind(this, function() {
        if(this.client.get_lid_is_closed()) {
          this.client.suspend_sync(null);
        }
      }));
    }
  },
  
  disable: function() {
    if(this.client.get_can_hibernate()) {
      this.hibernatemenuitem.destroy();
    }

    if(this.client.get_can_suspend()) {    
      this.suspendmenuitem.destroy();
      this.client.disconnect(this.handler_id);
    }
  }
};


function init() {
  Convenience.initTranslations('gnome-shell-extension');
  return new ShellSuspendOption();
}

