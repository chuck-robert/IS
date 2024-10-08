<template>
  <div class="settingContainer">
    <el-container>
      <el-aside class="aside">
        <ul class="type_list">
          <li v-for="(item, index) in types_list" :key="index" :class="{ active: index === types_active_index }" 
            @click="types_active_index = index">
            <i :class="item.icon" class="xl-transition-all"></i>
            <span class="text_color" @click.stop="types_active_index = index">{{ item.label }}</span>
          </li>
        </ul>
      </el-aside>
      <el-main class="main">
        <div v-for="(item, index) in types_list" :class="{ active: index === types_active_index }" :key="index"
          class="type_content">
          <template v-if="item.contents.group">
            <el-header class="group">
              <span class="text_color" v-for="(ii, i) in item.contents.pages" :key="i"
                :class="{ active: i === item.contents.default_page }" @click.stop="item.contents.default_page = i">{{
                  ii.label }}</span>
            </el-header>
            <el-main class="pages">
              <div class="page" v-for="(ii, i) in item.contents.pages" :key="i"
                :class="{ active: i === item.contents.default_page }">
                <dl v-for="(ji, j) in ii.items" :key="j" :class="{
                  disabled: !ji.condition(),
                  card: ji.type === 'card',
                }">
                  <template v-if="ji.type === 'card'">
                    <SettingCard :card="ji.card_name" :title="ji.text" />
                  </template>
                  <template v-else>
                    <dt>
                      <span class="title">{{ ji.label }}</span>
                      <span class="description">{{ ji.description }}</span>
                    </dt>
                    <dd>
                      <template v-if="ji.type === 'switch'">
                        <el-switch size="large" v-model="ji.default" @change="ji.action(ji.default)" />
                      </template>
                      <template v-else-if="ji.type === 'button'">
                        <button class="xn-btn primary" @click="ji.action">{{ ji.text }}</button>
                      </template>
                      <template v-else-if="ji.type === 'slider'">
                        <el-slider v-model="ji.default" :min="ji.min" :max="ji.max" :format-tooltip="ji.format_tooltip"
                          @change="ji.done(ji.default)" @input="ji.input(ji.default)"></el-slider>
                      </template>
                    </dd>
                  </template>
                </dl>
              </div>
            </el-main>
          </template>
          <template v-else>
            <main class="item_main">
              <dl v-for="(ji, j) in item.contents.page" :key="j" :class="{
                disabled: !ji.condition(),
                card: ji.type === 'card',
              }">
                <template v-if="ji.type === 'card'">
                  <SettingCard :card="ji.card_name" :title="ji.text" />
                </template>
                <template v-else>
                  <dt>
                    <span class="title">{{ ji.label }}</span>
                    <span class="description">{{ ji.description }}</span>
                  </dt>
                  <dd>
                    <template v-if="ji.type === 'switch'">
                      <el-switch size="large" v-model="ji.default" @change="ji.action(ji.default)" />
                    </template>
                    <template v-else-if="ji.type === 'button'">
                      <button class="xn-btn primary" @click="ji.action">{{ ji.text }}</button>
                    </template>
                    <template v-else-if="ji.type === 'slider'">
                      <el-slider v-model="ji.default" :min="ji.min" :max="ji.max" :format-tooltip="ji.format_tooltip"
                        @change="ji.done(ji.default)" @input="ji.input(ji.default)"></el-slider>
                    </template>
                  </dd>
                </template>
              </dl>
            </main>
          </template>
        </div>
      </el-main>
    </el-container>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import SettingCard from './setting_components/SettingCard.vue';
import { useStore } from 'vuex';
import { is } from '@/utils/is';

const { t } = useI18n();
const is_data = is().is_current.value;
const store = useStore();
const types_list_default = [
  {
    label: t('setting.theme'),
    icon: 'fas fa-palette',
    contents: {
      group: true,
      default_page: 0,
      pages: [
        {
          label: t('setting.baseTheme'),
          icon: 'fas fa-palette',
          items: [
            {
              label: t('setting.darkMode'),
              description: t('setting.darkModeDescription'),
              type: 'switch',
              default: !is_data.theme.lightMode,
              condition: function () {
                return true;
              },
              action: function (value) {
                is_data.theme.lightMode = !value;
              }
            }, {
              label: t('setting.dynamic'),
              description: t('setting.dynamicDescription'),
              type: 'switch',
              default: is_data.theme.dynamic,
              condition: function () {
                return true;
              },
              action: function (value) {
                is_data.theme.dynamic = value;
              }
            }, {
              label: t('setting.closeCover'),
              description: t('setting.closeCoverDescription'),
              type: 'switch',
              default: is_data.theme.background.mark,
              condition: function () {
                return true;
              },
              action: function (value) {
                is_data.theme.background.mark = value;
              }
            }, {
              label: t('setting.maskOpacity'),
              description: t('setting.maskOpacityDescription'),
              type: 'slider',
              default: is_data.theme.background.mark_opacity * 100,
              max: 100,
              min: 0,
              format_tooltip: function (value) {
                return value + '%';
              },
              condition: function () {
                return true;
              },
              input: function (value) {
                is_data.theme.background.mark_opacity = value / 100;
              },
              done: function (value) {
                is_data.theme.background.mark_opacity = value / 100;
              }
            }, {
              label: t('setting.minimalMode'),
              description: t('setting.minimalModeDescription'),
              type: 'switch',
              default: is_data.theme.minimal_mode,
              condition: function () {
                return true;
              },
              action: function (value) {
                is_data.theme.minimal_mode = value;
              }
            }, {
              label: t('setting.background_blur'),
              description: t('setting.background_blur_description'),
              type: 'slider',
              default: is_data.theme.background.blur,
              max: 100,
              min: 0,
              format_tooltip: function (value) {
                return value + 'px';
              },
              condition: function () {
                return true;
              },
              input: function (value) {
                is_data.theme.background.blur = value;
              },
              done: function (value) {
                is_data.theme.background.blur = value;
              }
            }
          ]
        }, {
          label: t('setting.colorPage'),
          icon: 'fas fa-palette',
          items: [
            {
              text: t('setting.colorPage_text.color_custom'),
              type: 'card',
              card_name: 'color_custom',
              condition: function () {
                return true;
              }
            }, {

              text: t('setting.colorPage_text.color_default'),
              type: 'card',
              card_name: 'color_default',
              condition: function () {
                return true;
              }
            }
          ]
        }, {
          label: t('setting.staticWallpaper'),
          icon: 'fas fa-palette',
          items: [
            {
              condition: function () {
                return true;
              },
              label: t('setting.staticWallpaper_text.time'),
              description: t('setting.staticWallpaper_text.time_description'),
              type: 'button',
              text: t('action.click'),
              action: function () {
                is_data.theme.background.type = "time";
                is_data.theme.background.value = "";
                store.dispatch('updateBgType', "time");
              }
            }, {
              text: t('setting.staticWallpaper_text.upload'),
              type: 'card',
              card_name: 'staticWallpaper_upload',
              condition: function () {
                return true;
              }
            }, {
              text: t('setting.staticWallpaper_text.link'),
              type: 'card',
              card_name: 'staticWallpaper_link',
              condition: function () {
                return true;
              }
            }, {
              text: t('setting.staticWallpaper_text.color'),
              type: 'card',
              card_name: 'staticWallpaper_color',
              condition: function () {
                return true;
              }
            }, {
              text: t('setting.staticWallpaper_text.imgs'),
              type: 'card',
              card_name: 'staticWallpaper_imgs',
              condition: function () {
                return true;
              }
            }, {
              text: t('setting.staticWallpaper_text.random'),
              type: 'card',
              card_name: 'staticWallpaper_random',
              condition: function () {
                return true;
              }
            }
          ]
        }, {
          label: t('setting.dynamicWallpaper'),
          icon: 'fas fa-palette',
          items: [
            {
              type: 'card',
              text: t('setting.dynamicWallpaper_text.link'),
              card_name: "dynamicWallpaper_link",
              condition: function () {
                return true;
              }
            }, {
              type: 'card',
              text: t('setting.dynamicWallpaper_text.upload'),
              card_name: "dynamicWallpaper_upload",
              condition: function () {
                return true;
              }
            },
          ]
        }, {
          label: 'Wallhaven',
          icon: 'fas fa-palette',
          items: [
            {
              type: 'card',
              text: 'Wallhaven',
              card_name: "Wallhaven",
              condition: function () {
                return true;
              }
            }
          ]
        }
      ]
    }
  }, {
    label: '搜索设置',
    icon: 'fa fa-search',
    contents: {
      group: false,
      page: [
        {
          type: 'card',
          text: '点击我',
          card_name: "Wallhaven",
          condition: function () {
            return true;
          }
        }, {
          label: '暗黑模式',
          description: '开启暗黑模式',
          type: 'button',
          text: '点击我',
          default: false,
          condition: function () {
            return true; // 这里可以写一些条件，如果条件不满足，则不显示这个选项
          },
          action: function () {
            console.log(121212);
          }
        }, {
          label: '暗黑模式',
          description: '开启暗黑模式',
          type: 'switch',
          default: false,
          condition: function () {
            return false;
          },
          action: function (value) {
            console.log(value);
          }
        }
      ]
    }
  }, {
    label: '更多功能',
    icon: 'fas fa-plus',
    contents: {
      group: false,
      default_page: 0,
      page: [
        {
          label: '暗黑模式',
          description: '开启暗黑模式',
          type: 'button',
          text: '点击我',
          default: false,
          condition: function () {
            return true; // 这里可以写一些条件，如果条件不满足，则不显示这个选项
          },
          action: function () {
            console.log(121212);
          }
        }
      ]
    }
  }, {
    label: '林中木',
    icon: 'fa fa-search',
    contents: {
      group: false,
      default_page: 0,
      page: [

      ]
    }
  }
]
const types_list = ref(types_list_default);
const types_active_index = ref(0);
</script>

<style scoped lang="less">
.settingContainer {
  position: absolute;
  height: 55%;
  top: 15%;
  left: 0;
  right: 0;
  box-shadow: 0 0 20px #00000042;
  border-radius: 7px;
  max-width: 800px;
  min-width: 200px;
  width: 100%;
  margin: auto;
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  backdrop-filter: blur(10px);
  z-index: 1000;
  animation: fadeInScale 0.3s;
  max-height: 600px;
  min-height: 450px;

  .aside {
    width: 24%;

    .type_list {
      padding-top: 50px;

      background: var(--bg-3);
      height: 100%;
      padding-top: 50px;

      li {
        padding: 10px 15px;
        font-size: 15px;
        display: flex;
        align-items: center;
        transition: all 0.3s;

        i {
          width: 20px;
          color: var(--theme-color, #0084ff);
          margin: 5px 12px;
          font-size: 20px;
        }

        &.active {
          background: var(--bg-9);
        }
      }
    }
  }

  .main {
    width: 76%;
    background: var(--bg-4);
    display: flex;
    flex-direction: column;
    --el-main-padding: 0;

    .type_content {
      display: none;

      .group {
        display: flex;
        align-items: flex-end;
        --el-header-height: 80px;

        span {
          background: #00000017;
          padding: 10px;
          margin-right: 8px;
          border-radius: 5px;
          white-space: nowrap;
          transition: all 0.3s;
          align-items: center;
          display: flex;
          height: 40px;

          &.active {
            color: var(--theme-color, #0084ff);
            background: var(--theme-color_c, #0084ff10);
          }

          &:hover {
            color: var(--theme-color, #0084ff);
          }
        }
      }

      .pages {
        .page {
          display: none;

          &.active {
            display: block;
          }
        }
      }
    }

    .type_content.active {
      display: block;
    }

    .item_main {
      padding: 40px 20px;
    }

    dl {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 7px;

      dt {
        display: flex;
        flex-direction: column;

        span.title {
          font-size: 17px;
          color: var(--font-1);
        }

        span.description {
          opacity: .6;
          margin-top: 4px;
          font-size: 13px;
          color: var(--font-1);
        }
      }

      &.card {
        padding: 10px;
        background: var(--bg-9);
        border-radius: 5px;
        margin-bottom: 10px;
        -webkit-box-shadow: 0 0 7px #00000029;
        box-shadow: 0 0 7px #00000029;
      }

      &.disabled {
        opacity: .4;
        pointer-events: none;
      }
    }

    dd {
      width: 100%;
      text-align: right;
      max-width: 180px;
    }
  }

  main.pages,
  main.item_main,
  div.page {
    -webkit-animation: fadeInUp 0.5s ease-in-out;
    animation: fadeInUp 0.5s ease-in-out;
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateX(10px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

.xn-btn {
  padding: 7px 19px;
  border-radius: 5px;
  background: var(--btn-bg, #00000012);
  color: var(--btn-color, #363636);
  font-size: 12px;
  transition: all 0.3s;

  &:hover {
    color: white;
    background: var(--btn-color, #363636);
  }
}

.xn-btn.primary {
  --btn-bg: var(--theme-color_c, #0084ff12);
  --btn-color: var(--theme-color, #0084ff);
  background: var(--btn-bg, #0084ff12);
  color: var(--btn-color, #0084ff);
  font-size: 12px;

  &:hover {
    color: white;
    --btn-bg: var(--theme-color, #0084ff);
    background: var(--btn-color, #0084ff);
  }
}
</style>