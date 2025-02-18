import * as React from 'react'
import { PageWrapper } from '../PageWrapper'
import { MarketPriceCalc } from '../calculators/MarketPriceCalc/MarketPriceCalc'

export interface MarketPriceCalcPageProps {
  propA?: string
}

export const MarketPriceCalcPage: React.FC<MarketPriceCalcPageProps> = ({ propA }) => {
  // const theme = useTheme()

  return (
    <PageWrapper title="Market Price Finder" maxWidth="lg">
      <MarketPriceCalc />
    </PageWrapper>
  )
}

export const MarketPriceCalcPageContainer: React.FC = () => {
  return <MarketPriceCalcPage />
}
