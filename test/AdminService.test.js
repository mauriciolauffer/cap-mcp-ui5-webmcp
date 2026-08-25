import cds from '@sap/cds'

const { GET, POST, expect, defaults } = cds.test (import.meta.dirname+'/..')
defaults.auth = { username: 'alice', password: '' }

describe('AdminService OData APIs', () => {

  it('serves AdminService.Authors', async () => {
    const { data } = await GET `/odata/v4/admin/Authors ${{ params: { $select: 'ID,name' } }}`
    expect(data.value).to.containSubset([
      // {"ID":22750207,"name":"name-22750207"},
    ])
  })

})
