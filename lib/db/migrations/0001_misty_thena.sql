CREATE TYPE "public"."end_condition" AS ENUM('empty_hand', 'mercy_rule');--> statement-breakpoint
CREATE TYPE "public"."game_mode" AS ENUM('classic', 'no_mercy');--> statement-breakpoint
CREATE TABLE "game_session" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_session_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"winner_id" integer NOT NULL,
	"mode" "game_mode" NOT NULL,
	"end_condition" "end_condition" NOT NULL,
	"score_awarded" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_session_player" (
	"game_session_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "game_session_player_game_session_id_user_id_pk" PRIMARY KEY("game_session_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "player_profile" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"cumulative_score" integer DEFAULT 0 NOT NULL,
	"total_wins" integer DEFAULT 0 NOT NULL,
	"total_losses" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_session" ADD CONSTRAINT "game_session_winner_id_user_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session_player" ADD CONSTRAINT "game_session_player_game_session_id_game_session_id_fk" FOREIGN KEY ("game_session_id") REFERENCES "public"."game_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_session_player" ADD CONSTRAINT "game_session_player_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_profile" ADD CONSTRAINT "player_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;