<template>
    <div>
        <h1>ㅇㅇ</h1>
    </div>

  <section class="py-5 text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">동까유머</h1>
        <p class="lead text-muted">에펨, 펨코, 팸코, fmkorea, fm, 디시, 디시인사이드, dc, dcinside, 커뮤, 커뮤니티, 오유, 오늘의유머, 웃대, 웃긴대학, 짱공유, 고급유머, 깨글, 개그, gag, 9gag, 레딧, radit  -동까유머
        , 동까 유머, 동까우머, 동가유머, 동까유머, 동까 우머, 재미있는 각종 유머글 모음 사이트, 유머 사이트 추천, 심심할 때,유머 모음, 재밌는 글, 유머 게시판, 아프라카, 인터넷 방송, 뉴스, bj, 축구, 스타, 게임, 예능, 티비, tv, 야구, mlb, 음식, 먹방 -동까유머</p>
      </div>
    </div>
  </section>

  <div class="album py-5 bg-light">
    <div class="container">

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div class="col">
          <div class="card shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                <title>Placeholder</title>
                <rect width="100%" height="100%" fill="#55595c"/>
                <image href="@/assets/stock_chart.png" x="0" y="0" height="100%" width="100%"/>
            </svg>

            <div class="card-body">
              <p class="card-text">1등 유머 사이트!</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">읽어보기</button>
                  <button v-if="hasMemberInfo && isCurrentUser" type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                </div>
                <small class="text-muted">9 mins</small>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>

</script>
