import { Wrapper } from './wrapper';

async function bootstrap() {
    const wrapper: Wrapper = new Wrapper();
    await wrapper.run();
}

bootstrap();