import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';


@Module({
  imports:[CloudinaryModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
