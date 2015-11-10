modules.define('page', ['i-bem__dom', 'i18n'], function(provide, BEMDOM, i18n) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                alert(i18n('root', 'main'));
            }
        }
    }
}));

});
