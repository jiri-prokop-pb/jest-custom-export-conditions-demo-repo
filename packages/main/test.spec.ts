import { FetchInterceptor } from '@mswjs/interceptors/fetch'
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getEnv } from 'different-exports';

const interceptor = new FetchInterceptor();

interceptor.apply();

interceptor.on('request', ({ controller }) => {
  controller.respondWith(Response.json({ data: getEnv() }));
});

describe('test with MSW', () => {
  const server = setupServer();

  afterEach(() => {
    server.resetHandlers();
  });

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it('should fetch', async () => {
    let params: URLSearchParams = new URLSearchParams();

    server.use(
      http.get('/api', ({ request }) => {
        const url = new URL(request.url);

        params = url.searchParams;

        return HttpResponse.json({
          data: getEnv(),
        });
      }),
    );

    const response = await fetch('/api?models[]=a&models[]=b');

    expect(await response.json()).toEqual({
      data: 'browser',
    });

    expect(params.getAll('models[]')).toEqual(['a', 'b']);
  });

  it('should fetch through interceptors', async () => {
    const response = await fetch('/other-api');

    expect(await response.json()).toEqual({
      data: 'browser',
    });
  });
});