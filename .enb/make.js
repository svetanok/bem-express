var techs = {
        fileProvider: require('enb/techs/file-provider'),
        fileMerge: require('enb/techs/file-merge'),
        borschik: require('enb-borschik/techs/borschik'),
        stylus: require('enb-stylus/techs/stylus'),
        keysets: require('enb-bem-i18n/techs/keysets'),
        i18n: require('enb-bem-i18n/techs/i18n'),
        browserJs: require('enb-js/techs/browser-js'),
        prependYm: require('enb-modules/techs/prepend-modules'),
        nodeJs: require('enb-js/techs/node-js'),
        bemtree: require('enb-bemxjst-i18n/techs/bemtree-i18n'),
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    levels = [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        { path: 'libs/bem-history/common.blocks', check: false },
        'common.blocks'
    ],
    langs = require('../server/config').langs;

var isProd = process.env.YENV === 'production';
isProd || levels.push('development.blocks');

module.exports = function(config) {
    config.setLanguages(langs);

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: levels }],
            [techs.fileProvider, { target: '?.bemdecl.js' }],
            [enbBemTechs.deps],
            [enbBemTechs.files],

            // css
            [techs.stylus, {
                target: '?.css',
                autoprefixer: {
                    browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
                }
            }],

            // i18n
            [techs.keysets, { lang: '{lang}' }],
            [techs.i18n, {
                exports: { ym: true },
                lang: '{lang}'
            }],

            // bemtree
            [techs.bemtree, {
                lang: '{lang}',
                sourceSuffixes: ['bemtree.js', 'bemtree']
            }],

            // templates
            [techs.bemhtml, { sourceSuffixes: ['bemhtml.js', 'bemhtml'] }],

            // client templates
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.tmpl.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.tmpl.deps.js',
                bemdeclFile: '?.tmpl.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.tmpl.deps.js',
                filesTarget: '?.tmpl.files',
                dirsTarget: '?.tmpl.dirs'
            }],
            [techs.bemhtml, {
                target : '?.browser.bemhtml.js',
                filesTarget : '?.tmpl.files',
                sourceSuffixes: ['bemhtml.js', 'bemhtml']
            }],

            // node.js
            [techs.nodeJs, { includeYM: true }],

            // js
            [techs.browserJs],
            [techs.fileMerge, {
                target: '?.pre.{lang}.js',
                sources: ['?.lang.{lang}.js', '?.browser.bemhtml.js', '?.browser.js'],
                lang: '{lang}'
            }],
            [techs.prependYm, {
                source: '?.pre.{lang}.js',
                target: '?.{lang}.js'
            }],

            // borschik
            [techs.borschik, { sourceTarget: '?.{lang}.js', destTarget: '?.{lang}.min.js', minify: isProd }],
            [techs.borschik, { sourceTarget: '?.css', destTarget: '?.min.css', tech: 'cleancss', minify: isProd }]
        ]);

        nodeConfig.addTargets(['?.bemtree.{lang}.js', '?.bemhtml.js', '?.node.js', '?.min.css', '?.{lang}.min.js']);
    });
};
