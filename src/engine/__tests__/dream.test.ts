import { describe, it, expect } from 'vitest'
import { tagDream } from '../dream'

const labels = (text: string) => tagDream(text).map((t) => t.label)

describe('tagDream', () => {
  it('複合文本：「被老闆追著跑」→ 焦慮 + 工作 + 追逐', () => {
    const l = labels('夢到被老闆追著跑')
    expect(l).toContain('焦慮')
    expect(l).toContain('工作')
    expect(l).toContain('追逐')
  })

  it('開心組：飛/朋友', () => {
    const l = labels('和朋友一起飛過城市')
    expect(l).toContain('開心')
    expect(l).toContain('飛行')
    expect(l).toContain('人物')
  })

  it('模糊組', () => {
    expect(labels('不記得了，很模糊')).toContain('模糊')
  })

  it('無關鍵字時預設平靜', () => {
    expect(labels('在一個房間裡走來走去')).toEqual(['平靜'])
  })

  it('情緒標籤 kind=emotion、主題標籤 kind=theme', () => {
    const tags = tagDream('被老闆追')
    expect(tags.find((t) => t.label === '焦慮')?.kind).toBe('emotion')
    expect(tags.find((t) => t.label === '工作')?.kind).toBe('theme')
  })
})
