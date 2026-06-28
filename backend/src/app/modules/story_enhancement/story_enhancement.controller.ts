import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { StoryEnhancementService } from './story_enhancement.service';

@Controller('api/v1/stories/enhance')
export class StoryEnhancementController {
  constructor(private readonly enhancementService: StoryEnhancementService) {}

  @Post('style')
  applyStyleTransfer(
    @Body()
    dto: {
      story: string;
      style: 'formal' | 'casual' | 'poetic' | 'dark' | 'humorous';
    },
  ) {
    if (!dto.story || !dto.style) {
      throw new BadRequestException('story and style are required');
    }

    const enhanced = this.enhancementService.applyStyleTransfer({
      story: dto.story,
      style: dto.style,
    });

    return {
      success: true,
      original: dto.story,
      enhanced,
      style: dto.style,
    };
  }

  @Post('tone')
  adaptTone(
    @Body()
    dto: {
      story: string;
      tone: 'serious' | 'lighthearted' | 'dramatic' | 'mysterious' | 'inspiring';
    },
  ) {
    if (!dto.story || !dto.tone) {
      throw new BadRequestException('story and tone are required');
    }

    const enhanced = this.enhancementService.adaptTone({
      story: dto.story,
      tone: dto.tone,
    });

    return {
      success: true,
      original: dto.story,
      enhanced,
      tone: dto.tone,
    };
  }

  @Post('full')
  enhanceStory(
    @Body()
    dto: {
      story: string;
      style: 'formal' | 'casual' | 'poetic' | 'dark' | 'humorous';
      tone: 'serious' | 'lighthearted' | 'dramatic' | 'mysterious' | 'inspiring';
    },
  ) {
    if (!dto.story || !dto.style || !dto.tone) {
      throw new BadRequestException('story, style, and tone are required');
    }

    const result = this.enhancementService.enhanceStory(
      dto.story,
      dto.style,
      dto.tone,
    );

    return {
      success: true,
      ...result,
    };
  }
}
