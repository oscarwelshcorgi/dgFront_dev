<template>
  <div class="container mt-5">
    <form @submit.prevent="submitPost" class="mt-3">

      <div class="form-group">
        <label for="board">게시판 선택:</label>
        <select id="board" v-model="post.boardCode" class="form-control" required>
          <option value="">게시판 선택</option>
          <option value="customer">고객센터</option>
          <option value="humor">유머게시판</option>
        </select>
      </div>

      <div class="form-group">
        <input type="text" id="title" v-model="post.title" required maxlength="100" class="form-control" style="font-size: 30px; font-weight: bold;" placeholder="제목을 입력해주세요.">
      </div>

      <!-- content 작성 -->
      <div ref="editor" id="content" required class="quill-editor" style="font-size: 20px; margin-bottom: 130px;"></div>

      <button type="submit" class="btn btn-primary">{{ post.id ? '게시글 수정' : '게시글 작성' }}</button>
    </form>
  </div>
</template>

<script>

import Quill from 'quill'; // Quill 라이브러리 임포트

export default {

  data() {
    return {
      requestBody: this.$route.query,
      id: this.$route.query.id,
      post: {
        id: null,
        title: '',
        content: '',
        boardCode: '',
        deleteYn:''
      }
    };
  },
  computed: {
    memberInfo() {
      return this.$store.getters.getMemberInfo;
    }
  },
  created() {
    this.fetchMemberInfo();
    this.fnEditPost(); // 컴포넌트 생성 시 게시글 수정 모드로 진입. id 가져와서 해당 게시글 데이터 출력
  },

  mounted() {
    // Quill 에디터 초기화
    this.quill = new Quill(this.$refs.editor, {
      theme: 'snow',
      placeholder: '내용을 입력해주세요.',
      modules: {
        toolbar: [
          // 툴바 설정은 필요에 따라 추가 설정 가능
          [{ 'size': ['large', 'huge'] }], // 폰트 크기 조절 옵션 추가
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['link'],
        ],
      },
    });
    // Quill 에디터가 정상적으로 작동하지 않으면 메시지 출력
    if (!this.quill) {
      console.error("Quill editor initialization failed.");
    }
    // Quill 에디터의 내용을 Vue 데이터와 양방향 바인딩
    this.quill.on('text-change', () => {
      this.post.content = this.quill.root.innerHTML;
    });
  },

  methods: {
    fetchMemberInfo() {
      this.$store.dispatch('fetchMemberInfo')
        .then(() => {
          console.log('회원 정보를 성공적으로 가져왔습니다.');
        })
        .catch(error => {
          console.error('회원 정보를 가져오는 중 오류 발생:', error);
        });
    },
    submitPost() {
      if (!this.memberInfo) {
        console.error('회원 정보를 가져올 수 없습니다.');
        return;
      }

      this.post.nick_name = this.memberInfo.nickName;
      this.post.email = this.memberInfo.email;

      const apiUrl = `${this.$serverUrl}/api/humorBoard/${this.post.id ? 'update' : 'create'}`;
      const method = this.post.id ? 'patch' : 'post';

      this.$axios[method](apiUrl, this.post)
        .then(response => {
          const postId = response.data.id;
          alert('게시글이 저장되었습니다.');

          if (postId) {
            this.$router.push({
              path: '/board/boardList',
              query: this.requestBody
            }); // 저장된 게시글 상세 페이지로 이동
          } else {
            console.error('저장된 게시글의 ID를 가져올 수 없습니다.');
          }
        })
        .catch(error => {
          console.error('게시글 저장 실패:', error);
          alert('게시글 저장 중 오류가 발생했습니다.');
        });
    },
    fnEditPost() {
      if (this.id) {
        const apiUrl = `${this.$serverUrl}/api/humorBoard/detail/${this.id}`;

        this.$axios.get(apiUrl)
          .then(response => {
            const { id, title, content, boardCode, deleteYn } = response.data;
            this.post = { id, title, content, boardCode, deleteYn };

            // Quill 에디터의 내용도 초기화된 데이터로 설정(수정 시 content 가져오기)
            if (this.quill) {
              this.quill.root.innerHTML = this.post.content;
            }
          })
          .catch(error => {
            console.error('게시글 정보를 가져오는 중 오류 발생:', error);
          });
      }
    }
  }
};
</script>