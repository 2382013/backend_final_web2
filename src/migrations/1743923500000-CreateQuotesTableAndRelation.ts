import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuotesTableAndRelation1743923500000 implements MigrationInterface {
    name = 'CreateQuotesTableAndRelation1743923500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE quotes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await queryRunner.query(`
            ALTER TABLE quotes
            ADD CONSTRAINT FK_quotes_user
            FOREIGN KEY (user_id) REFERENCES users(id)
            ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE quotes DROP CONSTRAINT FK_quotes_user;`);
        await queryRunner.query(`DROP TABLE quotes;`);
    }
}
