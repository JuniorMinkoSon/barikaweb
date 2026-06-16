import { Order } from './types';
import type { Theme } from '../../theme';
import { X, Star, MapPin } from 'lucide-react';

interface OrderDetailsPopupProps {
  order: Order;
  rating: number;
  comment: string;
  onClose: () => void;
  onSubmitReview: () => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  theme: Theme;
}

export const OrderDetailsPopup = ({
  order,
  rating,
  comment,
  onClose,
  onSubmitReview,
  onRatingChange,
  onCommentChange,
  theme
}: OrderDetailsPopupProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end'
    }}>
      <div
        style={{
          backgroundColor: theme.colors.white,
          width: '100%',
          maxWidth: 500,
          margin: '0 auto',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: `${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing['2xl']}`,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          marginBottom: 90
        }}
      >
        {/* Bouton de fermeture fixe */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: theme.spacing.md,
            right: theme.spacing.md,
            padding: theme.spacing.xs,
            zIndex: 10,
            cursor: 'pointer',
            background: 'none',
            border: 'none'
          }}
        >
          <X size={24} style={{ color: theme.colors.gray[500] }} />
        </button>

        {/* Contenu de la popup */}
        <div style={{ marginTop: theme.spacing.md }}>
          {/* En-tête */}
          <div style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
            <h2 style={{
              fontSize: theme.fontSize.xl,
              fontWeight: 700,
              color: theme.colors.secondary,
              marginBottom: 4
            }}>
              {order.productName}
            </h2>
            <p style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.gray[500]
            }}>
              ID: {order.id}
            </p>
          </div>

          {/* Image et infos de base */}
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            alignItems: 'center'
          }}>
            <img
              src={order.image}
              style={{
                width: 96,
                height: 80,
                objectFit: 'cover',
                borderRadius: 16,
                border: `2px solid ${theme.colors.gray[100]}`
              }}
              alt={order.productName}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: 4 }}>
                <MapPin size={16} style={{ color: theme.colors.gray[400] }} />
                <p style={{
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.gray[600]
                }}>
                  {order.location}
                </p>
              </div>
              <p style={{
                fontSize: theme.fontSize.sm,
                color: theme.colors.gray[500]
              }}>
                {order.date}
              </p>
            </div>
          </div>

          {/* Code de validation (si en attente) */}
          {order.status === 'en_attente' && order.validationCode && (
            <div style={{
              padding: theme.spacing.md,
              backgroundColor: theme.colors.primaryLight,
              borderRadius: 16,
              marginBottom: theme.spacing.lg
            }}>
              <p style={{
                fontSize: theme.fontSize.sm,
                fontWeight: 600,
                color: theme.colors.primary,
                marginBottom: theme.spacing.xs
              }}>
                Code de validation
              </p>
              <div style={{
                backgroundColor: theme.colors.white,
                padding: theme.spacing.md,
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: theme.fontSize['3xl'],
                  fontWeight: 700,
                  color: theme.colors.primary
                }}>
                  {order.validationCode}
                </p>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.primary,
                  marginTop: theme.spacing.xs
                }}>
                  Montrez ce code au vendeur pour valider votre commande
                </p>
              </div>
            </div>
          )}

          {/* Période */}
          <div style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 16,
            marginBottom: theme.spacing.md
          }}>
            <p style={{
              fontSize: theme.fontSize.sm,
              fontWeight: 600,
              color: theme.colors.gray[600],
              marginBottom: theme.spacing.sm
            }}>
              Période
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: theme.spacing.md }}>
              <div>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[400],
                  marginBottom: 4
                }}>
                  Début
                </p>
                <p style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: 600,
                  color: theme.colors.gray[800]
                }}>
                  {order.details.startDate}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[400],
                  marginBottom: 4
                }}>
                  Fin
                </p>
                <p style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: 600,
                  color: theme.colors.gray[800]
                }}>
                  {order.details.endDate}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[400],
                  marginBottom: 4
                }}>
                  Durée
                </p>
                <p style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: 600,
                  color: theme.colors.gray[800]
                }}>
                  {order.details.duration}
                </p>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 16,
            marginBottom: theme.spacing.md
          }}>
            <p style={{
              fontSize: theme.fontSize.sm,
              fontWeight: 600,
              color: theme.colors.gray[600],
              marginBottom: theme.spacing.sm
            }}>
              Prix
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[400],
                  marginBottom: 4
                }}>
                  {order.details.pricePerDay ? 'Prix/jour' : 'Prix'}
                </p>
                <p style={{
                  fontSize: theme.fontSize.base,
                  fontWeight: 600,
                  color: theme.colors.gray[800]
                }}>
                  {order.details.pricePerDay
                    ? `${order.details.pricePerDay.toLocaleString()} FCFA`
                    : `${order.total.toLocaleString()} FCFA`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[400],
                  marginBottom: 4
                }}>
                  Total
                </p>
                <p style={{
                  fontSize: theme.fontSize.xl,
                  fontWeight: 700,
                  color: theme.colors.primary
                }}>
                  {order.total.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{
            padding: theme.spacing.md,
            backgroundColor: theme.colors.gray[50],
            borderRadius: 16,
            marginBottom: theme.spacing.md
          }}>
            <p style={{
              fontSize: theme.fontSize.sm,
              fontWeight: 600,
              color: theme.colors.gray[600],
              marginBottom: theme.spacing.sm
            }}>
              Description
            </p>
            <p style={{
              fontSize: theme.fontSize.sm,
              color: theme.colors.gray[700]
            }}>
              {order.details.description}
            </p>
          </div>

          {/* Section d'avis (uniquement pour les commandes livrées sans avis) */}
          {order.status === 'livre' && order.rating === null && (
            <div style={{
              padding: theme.spacing.md,
              backgroundColor: theme.colors.gray[50],
              borderRadius: 16,
              marginBottom: theme.spacing.lg
            }}>
              <p style={{
                fontSize: theme.fontSize.sm,
                fontWeight: 600,
                color: theme.colors.gray[600],
                marginBottom: theme.spacing.md
              }}>
                Noter cette expérience
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: theme.spacing.md
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onRatingChange(star)}
                    style={{ padding: theme.spacing.xs }}
                  >
                    <Star
                      size={28}
                      fill={star <= rating ? theme.colors.primary : 'none'}
                      stroke={theme.colors.primary}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                placeholder="Partagez votre expérience..."
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.gray[200]}`,
                  borderRadius: 12,
                  marginBottom: theme.spacing.md,
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.gray[800],
                  backgroundColor: theme.colors.white,
                  minHeight: 100,
                  resize: 'vertical'
                }}
                rows={4}
              />

              <button
                onClick={onSubmitReview}
                disabled={rating === 0}
                style={{
                  width: '100%',
                  padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                  backgroundColor: rating === 0 ? theme.colors.gray[200] : theme.colors.primary,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: 12,
                  fontSize: theme.fontSize.base,
                  fontWeight: 600,
                  cursor: rating === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Soumettre l'avis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};