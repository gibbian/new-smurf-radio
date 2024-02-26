import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const djs = pgTable("dj", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),

  joined: timestamp("joined", { withTimezone: true })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(3)`),
});

// This will be super important
export const djsRelations = relations(djs, ({ one, many }) => ({
  user: one(users, { fields: [djs.id], references: [users.djId] }),
  shows: many(shows),
  slot: many(slots),
}));

export const shows = pgTable("show", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),

  djId: varchar("dj", { length: 255 })
    .notNull()
    .references(() => djs.id, { onDelete: "cascade" }),

  // Shortcut to prevent a join on every show fetch
  djName: varchar("dj_name", { length: 255 }).notNull(),

  genres: varchar("genres", { length: 255 }).array(),

  startTime: timestamp("start_time", {
    withTimezone: true,
  })
    .notNull()
    .unique(),
  endTime: timestamp("end_time", {
    withTimezone: true,
  }).notNull(),

  image: varchar("image", { length: 255 }),

  published: boolean("published").default(true),

  lastSaved: timestamp("last_saved", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),

  currentlyPlaying: varchar("currently_playing", { length: 255 }).references(
    () => songs.id,
  ),
});

export const slots = pgTable(
  "slot",
  {
    djId: varchar("dj", { length: 255 })
      .notNull()
      .unique()
      .references(() => djs.id, { onDelete: "cascade", onUpdate: "cascade" }),

    dayOfWeek: integer("day_of_week").notNull(),
    hourOfDay: integer("hour_of_day").notNull(),

    time: timestamp("time", { withTimezone: true }).notNull(),
  },
  (t) => {
    return {
      pk: primaryKey(t.djId, t.time),
    };
  },
);

export const chatMessages = pgTable("chat_message", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  showId: varchar("show_id", { length: 255 })
    .notNull()
    .references(() => shows.id, {
      onDelete: "cascade",
    }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp", {
    mode: "date",
  })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const songs = pgTable("song", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }),
  artistId: varchar("artist_id", { length: 255 }),
  album: varchar("album", { length: 255 }).notNull(),
  albumArt: varchar("album_art", { length: 255 }),
  albumId: varchar("album_id", { length: 255 }),
  externalUrl: varchar("external_url", { length: 255 }),
  duration: bigint("duration", { mode: "bigint" }),
  explicit: boolean("explicit").notNull().default(false),
  popularity: integer("popularity"),
  previewUrl: varchar("preview_url", { length: 255 }),

  // spotifyBlob: json("spotifyBlob").$type<SpotifyApi.TrackObjectFull>(),
});

// Join table from shows to songs
export const tracklists = pgTable(
  "tracklist",
  {
    showId: varchar("show_id", { length: 255 })
      .references(() => shows.id, {
        onDelete: "cascade",
      })
      .notNull(),
    songId: varchar("song_id", { length: 255 })
      .references(() => songs.id, {
        onDelete: "cascade",
      })
      .notNull(),
    index: bigint("index", { mode: "bigint" }).notNull(),
  },
  (t) => {
    return {
      pk: primaryKey(t.showId, t.songId),
    };
  },
);

export const tracklistsRelations = relations(tracklists, ({ one }) => ({
  show: one(shows, { fields: [tracklists.showId], references: [shows.id] }),
  song: one(songs, { fields: [tracklists.songId], references: [songs.id] }),
}));

export const showRelations = relations(shows, ({ one }) => ({
  dj: one(djs, { fields: [shows.djId], references: [djs.id] }),
}));

export const slotRelations = relations(slots, ({ one }) => ({
  dj: one(djs, { fields: [slots.djId], references: [djs.id] }),
}));

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default(""),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  accessLevel: integer("accessLevel").default(0),
  djId: varchar("dj_id", { length: 255 }).references(() => djs.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  dj: one(djs, { fields: [users.djId], references: [djs.id] }),
}));

export const accounts = pgTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint("expires_at", { mode: "bigint" }),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
