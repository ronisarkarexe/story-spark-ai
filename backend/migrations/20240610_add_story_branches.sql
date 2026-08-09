ALTER TABLE stories ADD COLUMN parent_story_id INTEGER;
ALTER TABLE stories ADD CONSTRAINT fk_story_branches_parent
  FOREIGN KEY (parent_story_id) REFERENCES stories(id) ON DELETE CASCADE;
ALTER TABLE stories ADD COLUMN branch_name TEXT;
CREATE INDEX idx_stories_parent ON stories(parent_story_id);
