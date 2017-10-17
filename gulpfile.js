/**
 * Created by Administrator on 2017/4/26.
 */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    async = require('async'),
    beeper = require('beeper'),
    gulpif = require('gulp-if'),
    reanme = require('gulp-rename'),
    md5Fingerprint = require('md5-fingerprint'),
    rmdir = require('rmdir'),
    makeUrlVersin = require('gulp-make-css-url-version'),
    fileinclude = require('gulp-file-include'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),
    revcollector = require('gulp-rev-collector');

var  exec = require('child_process').exec;
var src = 'src';
var dist = 'dist';
var assets = src+'/assets';
var config = {
    less:{
        watch:[assets+'/less/**/*.less'],
        src:[assets+'/less/**/*.less','!'+assets+'/less/less_modules/**/*'],
        dest:dist+'/assets/css',
        settings:{

        }
    },
    images:{

    },
    js:{

    },
    copy:{
        watch:[assets+'/**/*','!'+assets+'/less/**/*'],
        src:['src/assets/**/*','!src/assets/less/**/*.less'],
        dest:dist+'/assets'
    },
    inject:{
        static:[
            'src/assets/css/lib.min.css',
            'src/assets/css/common.css',
            'src/assets/css/login.css'
        ],
        src:'src/test.html',
        dest:dist
    },
    log:function (name) {
        var d = new Date();
        return name+'：'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
    }
};

//编译less
function compileLess() {
    var ls = config.less;
    console.log(ls.log);
    gulp.src(ls.src)
        .pipe(less())
        .pipe(gulp.dest('src/assets/css'))
        .pipe(gulp.dest(ls.dest));
}

gulp.task('i',function () {
    gulp.watch(['src/assets/less/**/*.less'],function () {
       compileLess();
    })
})


//合并lib 下的js
gulp.task('lib',function () {
    console.log('begin concat');
    gulp.src([
        "src/assets/libs/artdialog/dialog.js",
        "src/assets/libs/haierJsTooltips/haierJsTooltips.js",
        "src/assets/libs/formValidHelper/formvalidHelper.js",
        "src/assets/libs/slick/slick.min.js"
    ]).pipe(concat('lib.min.js'))
        .pipe(gulp.dest('src/assets/js'))
})

//合并lib下的css
gulp.task('css',function () {
    console.log('begin concat');
    gulp.src([
        "src/assets/libs/artdialog/dialog.css",
        "src/assets/libs/haierJsTooltips/haierJsTooltips.css",
        "src/assets/libs/slick/slick.css",
        "src/assets/libs/slick/slick-theme.css"
    ]).pipe(concat('lib.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('src/assets/css'))
})

//页面插件cc、js
gulp.task('inject',function () {
    var sources = gulp.src([
        'src/assets/css/lib.min.css',
        'src/assets/css/common.css',
        'src/assets/libs/jquery.min.js',
        'src/assets/libs/handlebars.js',
        'src/assets/js/lib.min.js',
        'src/assets/js/utils.js',
        'src/assets/js/common.js'
    ],{read:false})
    gulp.src('src/attention.html')
        .pipe(inject(sources))
        .pipe(gulp.dest('dist'))
})

//添加版本号(测试)
gulp.task('v',function () {
    return gulp.src('src/assets/css/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('test/css'));
});