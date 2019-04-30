/**
 * Tencent is pleased to support the open source community by making QMUI Web available.
 * Copyright (C) 2019 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */


// proxy 监视文件改动并重新载入
module.exports = (gulp, mix) => {

    gulp.task('proxy', (done) => {

        const showLog = () => {
            if (mix.config.browserSync.browserSyncShowLog) {
                return 'info';
            }
            return 'silent';
        };

        mix.browserSync.init({
            open: 'external',
            proxy: mix.config.browserSync.browserSyncProxy,
            port: mix.config.browserSync.browserSyncPort,
            host: mix.config.browserSync.browserSyncHost,
            logLevel: showLog(),
            logPrefix: mix.util.addColor(mix.timeFormat.getCurrentTime(), 'info'),
            startPath: mix.config.browserSync.browserSyncStartPath
        });
        gulp.watch(mix.config.browserSync.browserSyncWatchPath).on('all', mix.reload);

        done();
    });
};
