import { Order, StatusConfig } from './types';
import { MapPin, Car, Home, Trash2, Star } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  statusConfig: StatusConfig;
  onCancel: (id: string) => void;
  onDetails: (order: Order) => void;
  theme: any;
}

export const OrderCard = ({ order, statusConfig, onCancel, onDetails, theme }: OrderCardProps) => {
  return (
    <div style={{
      backgroundColor: theme.colors.white,
      borderRadius: 16,
      padding: theme.spacing.md,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      border: `1px solid ${theme.colors.gray[100]}`
    }}>
      <div className="flex gap-3">
        <div className="relative">
          <img
            src={order.image}
            style={{
              width: 80,
              height: 64,
              objectFit: 'cover',
              borderRadius: 12
            }}
            alt={order.productName}
          />
          <div style={{
            position: 'absolute',
            top: -8,
            left: -8,
            backgroundColor: theme.colors.white,
            padding: theme.spacing.xs,
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {order.productName.includes('Toyota') || order.productName.includes('Mercedes') ?
              <Car size={16} style={{ color: theme.colors.gray[600] }} /> :
              <Home size={16} style={{ color: theme.colors.gray[600] }} />
            }
          </div>
        </div>

        <div className="flex-1">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{
                fontSize: theme.fontSize.base,
                fontWeight: 700,
                color: theme.colors.secondary,
                marginBottom: 4
              }}>
                {order.productName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <MapPin size={14} style={{ color: theme.colors.gray[400] }} />
                <p style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.gray[500]
                }}>
                  {order.location}
                </p>
              </div>
              <p style={{
                fontSize: theme.fontSize.xs,
                color: theme.colors.gray[500]
              }}>
                ID: {order.id} • {order.date}
              </p>
            </div>
            <div style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              borderRadius: 12,
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              {statusConfig.icon}
              <span style={{ fontSize: theme.fontSize.xs, fontWeight: 700 }}>{statusConfig.label}</span>
            </div>
          </div>

          {order.status === 'en_attente' && order.validationCode && (
            <div style={{
              marginTop: theme.spacing.sm,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.primaryLight,
              borderRadius: 12
            }}>
              <p style={{
                fontSize: theme.fontSize.xs,
                fontWeight: 600,
                color: theme.colors.primary,
                marginBottom: 4
              }}>
                Code de validation
              </p>
              <p style={{
                fontSize: theme.fontSize['2xl'],
                fontWeight: 700,
                color: theme.colors.primary
              }}>
                {order.validationCode}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${theme.colors.gray[100]}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <p style={{
            fontSize: theme.fontSize.xs,
            color: theme.colors.gray[500],
            marginBottom: 2
          }}>
            Prix Total
          </p>
          <p style={{
            fontSize: theme.fontSize.lg,
            fontWeight: 700,
            color: theme.colors.secondary
          }}>
            {order.total.toLocaleString()} <span style={{ fontSize: theme.fontSize.xs }}>FCFA</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.xs }}>
          {order.status === 'en_attente' && (
            <button
              onClick={() => onCancel(order.id)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: 12,
                border: `1px solid ${theme.colors.gray[200]}`,
                backgroundColor: theme.colors.white,
                color: theme.colors.gray[600],
                fontWeight: 600,
                fontSize: theme.fontSize.xs,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                cursor: 'pointer'
              }}
            >
              <Trash2 size={14} />
              Annuler
            </button>
          )}
          <button
            onClick={() => onDetails(order)}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              borderRadius: 12,
              backgroundColor: theme.colors.secondary,
              color: theme.colors.white,
              fontWeight: 600,
              fontSize: theme.fontSize.xs,
              cursor: 'pointer'
            }}
          >
            Détails
          </button>
        </div>
      </div>

      {order.status === 'livre' && order.rating !== null && (
        <div style={{
          marginTop: theme.spacing.sm,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                fill={star <= order.rating! ? theme.colors.primary : 'none'}
                stroke={theme.colors.primary}
              />
            ))}
          </div>
          {order.comment && (
            <p style={{
              fontSize: theme.fontSize.xs,
              fontStyle: 'italic',
              color: theme.colors.gray[500],
              maxWidth: '70%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              "{order.comment}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};