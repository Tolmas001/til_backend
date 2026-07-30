import { Controller, Get, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getChats(@Request() req) {
    return this.chatService.getUserChats(req.user.id);
  }

  @Get(':id')
  async getChat(@Request() req, @Param('id') id: string) {
    return this.chatService.getChat(id, req.user.id);
  }

  @Post()
  async createChat(@Request() req, @Body() body: { title?: string; aiCharacter?: string }) {
    return this.chatService.createChat(req.user.id, body?.title, body?.aiCharacter);
  }

  @Post(':id/message')
  async sendMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.chatService.sendMessage(req.user.id, id, body.content);
  }
}
