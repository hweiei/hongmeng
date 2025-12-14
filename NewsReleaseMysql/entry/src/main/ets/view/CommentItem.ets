import Comment from '../models/Comment';


@Component
export struct CommentItem {
  comment: Comment = new Comment();

  build() {
    Row() {
      // 使用mine_normal图片作为头像
      Image($r('app.media.mine_normal'))
        .width(40)
        .height(40)
        .margin({ right: 10 })
        .borderRadius(20) // 圆形效果

      Column() {
        // 用户名和时间
        Row() {
          Text(this.comment.username)
            .fontSize(14)
            .fontWeight(500)
            .fontColor('#333')

          Blank()

          Text(this.comment.createTime)
            .fontSize(12)
            .fontColor('#999')
        }
        .width('100%')

        // 评论内容
        Text(this.comment.content)
          .fontSize(14)
          .fontColor('#333')
          .textAlign(TextAlign.Start)
          .width('100%')
          .margin({ top: 5 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .padding({ top: 10, bottom: 10 })
  }
}