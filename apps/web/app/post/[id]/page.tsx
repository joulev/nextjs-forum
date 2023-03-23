import { notFound } from 'next/navigation'
import { db, selectUuid } from 'db/node'
import Image from 'next/image'

const getPost = async (snowflakeId: string) => {
  return await db
    .selectFrom('posts')
    .innerJoin('users', 'users.snowflakeId', 'posts.userId')
    .select([
      selectUuid('posts.id').as('id'),
      'posts.title',
      'users.username',
      'users.avatarUrl as userAvatar',
      (eb) =>
        eb
          .selectFrom('messages')
          .select(eb.fn.countAll<number>().as('count'))
          .where('messages.postId', '=', eb.ref('posts.snowflakeId'))
          .as('messagesCount'),
    ])
    .where('posts.snowflakeId', '=', snowflakeId)
    .executeTakeFirst()
}

const getMessages = async (postId: string) => {
  return await db
    .selectFrom('messages')
    .select([selectUuid('id').as('id'), 'content'])
    .where('postId', '=', postId)
    .execute()
}

type PostProps = {
  params: { id: string }
}

const Post = async ({ params }: PostProps) => {
  const post = await getPost(params.id)
  const messages = await getMessages(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl">Next.js Discord Forum</h1>
      <div className="mt-4">
        <div className="text-2xl">{post.title}</div>
        <div className="mt-2 space-y-2">
          {messages.map((message) => (
            <div
              key={message.id.toString()}
              className="p-4 border border-gray-50 rounded"
            >
              <div className="text-lg">{message.content}</div>
              <div className="flex items-center space-x-2">
                <Image
                  src={post.userAvatar}
                  alt={`${post.username}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full w-5 h-5"
                />
                <div className="text-sm">{post.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Post