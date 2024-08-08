<template>
  <div class="container">
  <slot name="search">
    <div class="row">
      <div class="col-md-6">
        <button v-if="hasMemberInfo" type="button" class="btn btn-primary mb-3" style="float: left;" @click="fnWrite">글쓰기</button>
      </div>
      <div class="col-md-6">
        <div class="input-group mb-3">
          <select class="form-select" v-model="searchKey">
            <option value="">- 선택 -</option>
            <option value="nickName">작성자</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
          </select>
          <input type="text" class="form-control" v-model="searchValue" @keyup.enter="fnPage()">
          <button class="btn btn-outline-secondary" type="button" @click="fnPage()">검색</button>
        </div>
      </div>
    </div>
    </slot>

    <table class="table">
      <thead>
        <tr>
          <th scope="col">No</th>
          <th scope="col" style="width: 60%;">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">등록일시</th>
          <th scope="col">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, id) in boardList" :key="id">
          <td>{{ row.id }}</td>
          <td style="width: 60%; max-width: 0;">
            <a @click="onPostClicked(row)" style="cursor: pointer; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis;">{{ row.title }}</a>
          </td>
          <td>{{ row.nickName }}</td>
          <td>{{ row.createDate }}</td>
          <td>{{ row.viewCount }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination d-flex justify-content-center" v-if="paging.totalListCnt > 0">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paging.page === 1 }">
          <a class="page-link" href="#" @click.prevent="fnPage(1)">처음</a>
        </li>
        <li class="page-item" :class="{ disabled: paging.page === 1 }">
          <a class="page-link" href="#" @click.prevent="fnPage(paging.page - 1)">이전</a>
        </li>
        <li class="page-item" v-for="n in paginavigation()" :key="n" :class="{ active: paging.page === n }">
          <a class="page-link" href="#" @click.prevent="fnPage(n)">{{ n }}</a>
        </li>
        <li class="page-item" :class="{ disabled: paging.page === paging.totalPageCnt }">
          <a class="page-link" href="#" @click.prevent="fnPage(paging.page + 1)">다음</a>
        </li>
        <li class="page-item" :class="{ disabled: paging.page === paging.totalPageCnt }">
          <a class="page-link" href="#" @click.prevent="fnPage(paging.totalPageCnt)">마지막</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() { //변수생성
    return {
      requestBody: {}, //리스트 페이지 데이터전송
      //list: {}, //리스트 데이터
      no: '', //게시판 숫자처리
      boardList: [],

      paging: {
        block: 0,
        endPage: 0,
        nextBlock: 0,
        page: 0,
        pageSize: 0,
        prevBlock: 0,
        startIndex: 0,
        startPage: 0,
        totalBlockCnt: 0,
        totalListCnt: 0,
        totalPageCnt: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? parseInt(this.$route.query.page) : 1,
      size: this.$route.query.size ? parseInt(this.$route.query.size) : 10,
      searchKey: this.$route.query.sk ? this.$route.query.sk : '',
      searchValue: this.$route.query.sv ? this.$route.query.sv : '',
    };
  },
  mounted() {
    this.fnGetList()
  },

  computed: {
    // Vuex 스토어에서 세션 정보를 가져오는 computed 속성
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    },
    // 세션 정보가 있는지 확인하는 computed 속성
    hasMemberInfo() {
      return !!this.memberInfo;
    }
  },

  methods: {
    fnGetList() {
      this.requestBody = { // 데이터 전송
        sk: this.searchKey,
        sv: this.searchValue,
        page: this.page,
        size: this.size
      }
      this.$axios.get(this.$serverUrl + "/api/humorBoard/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {
        if (res.data.resultCode === "OK") {
          this.boardList = res.data.data; // boardList에 데이터 할당
          this.paging = res.data.pagination;
          this.no = this.paging.totalListCnt - ((this.paging.page - 1) * this.paging.pageSize);
        }

      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.');
        }
      });
    },
    fnView(id) {
      this.requestBody.id = id
      this.$router.push({
        path: './boardDetail',
        query: this.requestBody
      })
    },
    fnWrite() {
      this.$router.push({
        path: './boardWrite'
      })
    },
    fnPage(n) {
      if (this.page !== n) {
        this.page = n
      }
      this.fnGetList()
    },

    paginavigation() { // 페이징 처리 함수
      const pageNumber = [];
      const startPage = this.paging.startPage;
      const endPage = this.paging.endPage;
      for (let i = startPage; i <= endPage; i++) {
        pageNumber.push(i);
      }
      return pageNumber;
    },

    onPostClicked(row) {
      this.$emit('postClicked', row); // 게시글 제목 클릭 이벤트 발생. row 데이터 BoardDetail 화면으로 보내기.
      // 게시물 제목 클릭 시 상세 페이지로 이동
      this.requestBody.id = row.id
      this.$router.push({
        path: './boardDetail',
        query: this.requestBody
      });

      // 페이지 맨 위로 스크롤
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 부드럽게 스크롤
      });


    }
  }
}
</script>