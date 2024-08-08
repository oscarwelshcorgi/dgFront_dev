<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <!-- 세션 정보가 있고 이메일이 같은 경우에만 보이는 버튼 -->
        <div class="btn-group" role="group" aria-label="Button group">
          <button v-if="shouldDisplayButtons" type="button" class="btn btn-primary" @click="fnUpdate">수정</button>
          <button v-if="shouldDisplayButtons" type="button" class="btn btn-danger" @click="fnDelete">삭제</button>
          <button type="button" class="btn btn-danger" @click="showLoginAlert">게시물 신고</button>
          <button type="button" class="btn btn-secondary" @click="fnList">목록</button>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div class="fw-bold fs-4">{{ title }}</div>
          </div>
          <div class="card-body">
            <div class="fs-5" style="text-align: right;">
                <strong>작성자: {{ nickName }}, 작성일: {{ createDate }}, 조회수: {{ viewCount }}</strong>
            </div>
            <div>
              <!-- 애드센스 컨텐츠 상단 광고 -->
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-1107226096880396"
                   data-ad-slot="6457501361"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
            <div ref="editor" class="quill-viewer" v-html="content"></div>
            <div>
              <!-- 애드센스 컨텐츠 상단 광고 -->
              <ins class="adsbygoogle"
                   style="display:block"
                   data-ad-client="ca-pub-1107226096880396"
                   data-ad-slot="8736954420"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          </div>
        </div>

        <div>
          <BoardList :list="boardList" :paging="paging" @onPostClicked="onPostClicked">
            <template v-slot:search>
              <h1>-----------------------------------------------</h1>
            </template>
          </BoardList>
        </div>
      </div>
    </div>

    <div class="bottom_ad">
      <!-- 애드센스 하단 메뉴 광고 -->
        <!-- 수평형 지정 -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1107226096880396"
             data-ad-slot="6012089010"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>

      <!-- 애드핏 -->
      <!--
      <ins class="kakao_ad_area" style="display:none;"
          data-ad-unit="DAN-rJHzRSsW6ZKje7Ak"
          data-ad-width="320"
          data-ad-height="50"></ins>
      -->
    </div>

    <!-- 하단 메뉴 -->
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="bottom_menu d-flex justify-content-between">
          <div>
            <img src="@/assets/back.png" alt="Back" @click="goBack" style="cursor: pointer;"/>
          </div>

          <div v-if="nextBoardId !== null">
            <router-link :to="'/board/boardDetail?id=' + nextBoardId + '&page=' + page" @click="onNavigationClick(nextBoardId)">
              <img src="@/assets/up.png" alt="up"/>
            </router-link>
          </div>

          <div v-if="previousBoardId !== null">
            <router-link :to="'/board/boardDetail?id=' + previousBoardId + '&page=' + page" @click="onNavigationClick(previousBoardId)">
              <img src="@/assets/down.png" alt="Previous"/>
            </router-link>
          </div>

          <div>
            <router-link v-if="hasMemberInfo" to="/">
              <img src="@/assets/face.png"/>
            </router-link>
            <router-link v-else to="/">
              로그인X <img src="@/assets/face.png"/>
            </router-link>
          </div>

          <div>
            <img src="@/assets/setting.png" style="cursor: pointer;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import BoardList from './BoardList';
import { useMeta } from 'vue-meta';
import Swal from 'sweetalert2';

export default {
  components: {
    BoardList
  },

  data() {
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,
      title: '',
      nickName: '',
      content: '',
      createDate: '',
      email: '',
      viewCount: '',
      boardList: [],
      previousBoardId: '',
      nextBoardId: '',
      page: 1,
      paging: null,
    }
  },

  mounted() {
    // 광고 스크립트 로드 및 광고 초기화
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1107226096880396';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // 광고 초기화 스크립트
    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    this.fnGetView();
    this.loadAdsScript();

    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      modules: { toolbar: false },
      readOnly: true
    });

    if (!this.quill) {
      console.error("Quill editor initialization failed.");
    }

    this.quill.root.innerHTML = this.content;
  },

  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    },

    hasMemberInfo() {
      return !!this.memberInfo;
    },

    isCurrentUser() {
      return this.hasMemberInfo && this.memberInfo.email === this.email;
    },

    shouldDisplayButtons() {
      return this.hasMemberInfo && this.isCurrentUser;
    }
  },

  methods: {
    fnGetView() {
      this.$axios.get(this.$serverUrl + '/api/humorBoard/detail/' + this.id, {
        params: this.requestBody
      }).then((res) => {
        this.id = res.data.id;
        this.title = res.data.title;
        this.nickName = res.data.nickName;
        this.content = res.data.content;
        this.createDate = res.data.createDate;
        this.email = res.data.email;
        this.viewCount = res.data.viewCount;
        this.previousBoardId = res.data.previousBoardId;
        this.nextBoardId = res.data.nextBoardId;
        this.boardList = res.data.boardList;
        this.setDynamicMeta(res.data);
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.');
        }
      });
    },

    fnList() {
      delete this.requestBody.id;
      this.$router.push({
        path: './boardList',
        query: this.requestBody
      });
    },

    fnUpdate() {
      this.$router.push({
        path: './boardWrite',
        query: this.requestBody
      });
    },

    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return;

      this.$axios.delete(this.$serverUrl + '/api/humorBoard/delete/' + this.id, {})
          .then(() => {
            alert('삭제되었습니다.');
            this.fnList();
          }).catch((err) => {
        console.log(err);
      });
    },

    onPostClicked(row) {
      this.$router.push({
        path: './boardDetail',
        query: { id: row.id }
      });
      this.updateViewData(row);
      this.increaseViewCount(row.id);
    },

    updateViewData(data) {
      this.id = data.id;
      this.title = data.title;
      this.nickName = data.nickName;
      this.content = data.content;
      this.createDate = data.createDate;
      this.email = data.email;
      this.viewCount = data.viewCount;

      if (this.quill) {
        this.quill.root.innerHTML = this.content;
      }
    },

    increaseViewCount(id) {
      this.$axios.put(this.$serverUrl + '/api/humorBoard/increaseViewCount/' + id)
        .then(() => {
          console.log('조회수가 증가되었습니다.');
        }).catch((err) => {
          console.error('조회수 증가 중 오류가 발생했습니다.', err);
        });
    },

    onNavigationClick(id) {
      this.$axios.get(this.$serverUrl + '/api/humorBoard/detail/' + id)
        .then((res) => {
          this.updateViewData(res.data);
          this.$router.push({
            path: '/board/boardDetail?id=' + id,
            query: { id: id }
          });
          this.increaseViewCount(res.data.id);
          this.refreshPage();
        }).catch((err) => {
          console.error('이전 글 또는 다음 글 조회 중 오류가 발생했습니다.', err);
        });
    },

    goBack() {
      this.$router.go(-1);
    },

    refreshPage() {
      window.location.reload();
    },

    showLoginAlert() {
      if (this.hasMemberInfo) {
        Swal.fire({
          title: 'propofoloh@gmail.com 으로 문의 부탁드립니다.\n 신고 양식: 게시글 링크, 회원 이메일, 문의 내용',
          icon: 'info',
          confirmButtonText: '확인'
        });
      } else {
        Swal.fire({
          title: '게시물 신고를 위해서 로그인이 필요해요.',
          text: '로그인을 진행 할까요?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '로그인',
          cancelButtonText: '취소',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = 'http://localhost:8080/oauth2/authorization/google';
          }
        });
      }
    },

    setDynamicMeta(data) {
      const dynamicMeta = {
        id: data.id,
        title: data.title,
        description: '에펨, 펨코, 팸코, fmkorea, fm, 디시, 디시인사이드, dc, dcinside, 커뮤, 커뮤니티, 오유, 오늘의유머, 웃대, 웃긴대학, 짱공유, 고급유머, 깨글, 개그, gag, 9gag, 레딧, radit  -동까유머',
        keywords: '동까 유머, 동까우머, 동가유머, 동까유머, 동까 우머, 재미있는 각종 유머글 모음 사이트, 유머 사이트 추천, 심심할 때,유머 모음, 재밌는 글, 유머 게시판, 아프라카, 인터넷 방송, 뉴스, bj, 축구, 스타, 게임, 예능, 티비, tv, 야구, mlb, 음식, 먹방 -동까유머',
        ogType: 'website',
        ogTitle: data.title + ' -동까유머',
        ogDescription: data.content + ' -동까유머',
        ogUrl: 'https://dongga.net/board/boardDetail?id=' + data.id,
        ogImage: data.content,
      };

      useMeta({
        title: dynamicMeta.title || process.env.VUE_APP_TITLE,
        meta: [
          { vmid: 'description', name: 'description', content: dynamicMeta.description },
          { vmid: 'keywords', name: 'keywords', content: dynamicMeta.keywords },
          { vmid: 'og:type', name: 'og:type', content: dynamicMeta.ogType},
          { vmid: 'og:title', name: 'og:title', content: dynamicMeta.ogTitle },
          { vmid: 'og:description', name: 'og:description', content: dynamicMeta.ogDescription },
          { vmid: 'og:url', name: 'og:url', content: dynamicMeta.ogUrl },
          { vmid: 'og:image', name: 'og:image', content: dynamicMeta.ogImage }
        ]
      });
    },

    loadAdsScript() {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.kakaoAsyncLoad = () => {
          window.kakaoAd = window.kakaoAd || {};
          window.kakaoAd.async = true;
          window.kakaoAd.renderAd(this.$refs.kakaoAd);
        };
      };
    }
  }
}
</script>

<style scoped>
img {
  max-width: 90%;
  height: auto;
  object-fit: cover;
}
video {
  max-width: 90%;
  height: auto;
  object-fit: cover;
}
.bottom_menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 100;
  border-top: 1px solid black;
  background-color: white;
}
.bottom_menu > div {
  float: left;
  width: 20%;
  height: 100%;
  text-align: center;
  padding-top: 0;
}
.bottom_ad {
  position: fixed;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 100;
  border-top: 1px solid black;
  background-color: white;
  margin-bottom: 9px;
}
</style>
