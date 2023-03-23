import { Kysely } from 'kysely'
import {
  SnowflakeDataType,
  UuidDataType,
  uuidColumnBuilder,
} from '../migrations-utils.js'

export async function up(db: Kysely<any>): Promise<void> {
  // --- Users
  await db.schema
    .createTable('users')
    .addColumn('id', UuidDataType, uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique()
    )
    .addColumn('username', 'varchar(32)', (col) => col.notNull())
    .addColumn('discriminator', 'varchar(4)', (col) => col.notNull())
    .addColumn('avatarUrl', 'varchar(2048)', (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('users_snowflakeId_idx')
    .on('users')
    .column('snowflakeId')
    .execute()

  // -- Posts
  await db.schema
    .createTable('posts')
    .addColumn('id', UuidDataType, uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique()
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('isLocked', 'boolean', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('editedAt', 'datetime')
    .addColumn('userId', SnowflakeDataType)
    .execute()

  await db.schema
    .createIndex('posts_snowflakeId_idx')
    .on('posts')
    .column('snowflakeId')
    .execute()
  await db.schema
    .createIndex('posts_userId_idx')
    .on('posts')
    .column('userId')
    .execute()

  // -- Messages
  await db.schema
    .createTable('messages')
    .addColumn('id', UuidDataType, uuidColumnBuilder)
    .addColumn('snowflakeId', SnowflakeDataType, (col) =>
      col.notNull().unique()
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('createdAt', 'datetime', (col) => col.notNull())
    .addColumn('editedAt', 'datetime')
    .addColumn('userId', SnowflakeDataType, (col) => col.notNull())
    .addColumn('postId', SnowflakeDataType, (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex('messages_snowflakeId_idx')
    .on('messages')
    .column('snowflakeId')
    .execute()
  await db.schema
    .createIndex('messages_userId_idx')
    .on('messages')
    .column('userId')
    .execute()
  await db.schema
    .createIndex('messages_postId_idx')
    .on('messages')
    .column('postId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('messages').execute()
  await db.schema.dropTable('posts').execute()
  await db.schema.dropTable('users').execute()
}