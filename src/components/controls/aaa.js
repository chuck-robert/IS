import { ElNotification } from 'element-plus';
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { is } from '@/utils/is';
import { useStore } from 'vuex';
const store = useStore(); // 使用 Vuex store
const is_data = is().is_current.value;
const base64data = computed(() => store.state.base64data);
const bgType = computed(() => store.state.background_type);
const background_value_s = computed(() => store.state.background_value);
const background_type = ref('image');
const background_value = ref('');
const background_time_interval = ref(null);
defineProps({
    focus: {
        type: Boolean,
        default: false
    }
});

const backgroundBox = ref(null);
const setBackground = (bg) => {
    console.log(bg);
    background_time_interval.value && clearInterval(background_time_interval.value);
    background_type.value = bg.type;
    background_value.value = bg.value;
    const t = bg.type;
    if (t === "image") {
        background_value.value = localStorage.getItem("is_bg") || bg.value;
        // console.log(bg.value);
    } else if (t === "color") {
        backgroundBox.value.style.backgroundColor = bg.value;
    } else if (t === "time") {
        background_type.value = "color";
        background_value.value = bg.value;
        background_time_interval.value = setInterval(() => {
            background_value.value = "#" + getTime("HHHHMiMiSSSS");
        }, 1000);
    } else if (t === "video_file") {
        openIndexedDBForVideo();
    }
};
const getTime = (format) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return format.replace('YYYY', year)
        .replace('MoMo', month)
        .replace('DDDD', day)
        .replace('HHHH', hour)
        .replace('MiMi', minute)
        .replace('SSSS', second);
}
const createMediaElement = (type, src, className, attributes) => {
    const media = document.createElement(type);
    media.src = src;
    if (className) media.className = className;
    Object.entries(attributes || {}).forEach(([key, value]) => {
        media.setAttribute(key, value);
    });
    return media;
};
const handleVideoPlayback = (video) => {
    video.oncanplay = () => {
        video.play();
        video.style.opacity = 1;
    };
};
const openIndexedDBForVideo = () => {
    const r = indexedDB.open("VideoDatabase", 1);
    r.onsuccess = (ev) => {
        const db = ev.target.result;
        const transaction = db.transaction("videos", "readonly");
        const store = transaction.objectStore("videos");
        const request = store.getAll();

        request.onsuccess = () => {
            const videos = request.result;
            if (videos.length > 0) {
                const videoBlob = new Blob([videos[0].data], { type: "video/*" });
                const video = createMediaElement('video', URL.createObjectURL(videoBlob), null, { autoplay: "autoplay", muted: "muted", loop: "loop" });
                handleVideoPlayback(video);
            } else {
                showErrorNotification("IndexedDB中没有视频数据");
            }
        };
        request.onerror = () => showErrorNotification("检索视频数据时发生错误");
    };
    r.onerror = () => showErrorNotification("无法打开IndexedDB数据库");
};
const showErrorNotification = (message) => {
    ElNotification({
        title: 'Error',
        message,
        type: 'error',
    });
};
onMounted(async () => {
    const bg = ref(is_data.theme.background);
    setBackground(bg.value);
    await nextTick();
});
watch(base64data, (newValue) => {
    if (newValue) {
        setBackground({ type: "image", value: newValue });
    }
});
watch(bgType, (newValue) => {
    console.log("变化");
    if (newValue) {
        background_type.value = newValue;
        setBackground({ type: "time", value: '' });
        console.log(background_type,background_value);
    }
});
watch(background_value_s, (newValue) => {
    console.log("bgc变化");
    if (newValue) {
        
        if (bgType.value == 'image') {
            setBackground({ type: bgType, value: newValue });
        }
        console.log(bgType,newValue);
        console.log(newValue);
    }
});