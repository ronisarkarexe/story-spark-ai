import { Module } from '@nestjs/common';
import { StoryEnhancementService } from './story_enhancement.service';
import { StoryEnhancementController } from './story_enhancement.controller';

@Module({
  providers: [StoryEnhancementService],
  controllers: [StoryEnhancementController],
  exports: [StoryEnhancementService],
})
export class StoryEnhancementModule {}
