import './SettlementsList.css'
import { ArrowRightLeft, Check } from 'lucide-react'
import { formatAmount } from '../../utils/utils'
import { groupSettlementsByPerson } from '../../data'
import { usePeople } from '../../hooks/usePeople'

function SettlementsList({ settlements, people }) {
  const { getPersonName, getPersonColor } = usePeople(people)
  const grouped = groupSettlementsByPerson(settlements, people)

  return (
    <section className='settlements'>
      <h4>Settlements</h4>
      <div className='settlements__grid'>
        {people.map((person) => {
          const personData = grouped[person.id]
          const hasActivity =
            personData.pays.length > 0 || personData.receives.length > 0

          if (!hasActivity) return null

          return (
            <div
              key={person.id}
              className='settlements__card'
              style={{ borderColor: getPersonColor(person.id) }}
            >
              <div className='settlements__header'>
                <div
                  className='settlements__avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className='settlements__name'>{person.name}</span>
              </div>

              <div
                className='settlements__details'
                style={{ borderTopColor: getPersonColor(person.id) }}
              >
                {personData.pays.length > 0 && (
                  <>
                    <div className='settlements__detail'>
                      <span className='settlements__label'>Pays</span>
                      <span className='settlements__value settlements__value--pays'>
                        ₱
                        {formatAmount(
                          personData.pays.reduce((sum, p) => sum + p.amount, 0),
                        )}
                      </span>
                    </div>
                    <div className='settlements__payments'>
                      {personData.pays.map((payment, idx) => (
                        <div key={idx} className='settlements__payment'>
                          <div className='settlements__person'>
                            <span
                              className='settlements__mini-avatar'
                              style={{
                                backgroundColor: getPersonColor(payment.to),
                              }}
                            >
                              {getPersonName(payment.to)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                            <span>to {getPersonName(payment.to)}</span>
                          </div>
                          <span className='settlements__amount'>
                            ₱{formatAmount(payment.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {personData.receives.length > 0 && (
                  <>
                    <div className='settlements__detail'>
                      <span className='settlements__label'>Receives</span>
                      <span className='settlements__value settlements__value--receives'>
                        ₱
                        {formatAmount(
                          personData.receives.reduce(
                            (sum, r) => sum + r.amount,
                            0,
                          ),
                        )}
                      </span>
                    </div>
                    <div className='settlements__payments'>
                      {personData.receives.map((receipt, idx) => (
                        <div key={idx} className='settlements__payment'>
                          <div className='settlements__person'>
                            <span
                              className='settlements__mini-avatar'
                              style={{
                                backgroundColor: getPersonColor(receipt.from),
                              }}
                            >
                              {getPersonName(receipt.from)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                            <span>from {getPersonName(receipt.from)}</span>
                          </div>
                          <span className='settlements__amount'>
                            ₱{formatAmount(receipt.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SettlementsList
