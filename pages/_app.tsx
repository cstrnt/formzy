import {
  ThemeProvider,
  CSSReset,
  theme as ChakraTheme,
  DefaultTheme,
} from '@chakra-ui/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SWRConfig } from 'swr'
import Layout from '../src/components/layout'
import { fetcher } from '../src/lib/helpers'

dayjs.extend(relativeTime)

const theme: DefaultTheme = {
  ...ChakraTheme,
  fonts: {
    ...ChakraTheme.fonts,
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
}

function App(props: any) {
  const { Component, pageProps } = props
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
      }}
    >
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SWRConfig>
  )
}

export default App
